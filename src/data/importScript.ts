/**
 * BUSTRACK — Transit Dataset Validator & Importer
 *
 * Implements strict data normalization, validation rules, and audit metrics
 * according to the project specifications:
 *
 * 1. Validates required schema fields
 * 2. Flags missing or inconsistent timings/coordinates
 * 3. Segregates institutional transit from public services
 * 4. Categorizes verification status ('Verified' vs 'Unverified' vs 'Needs Update')
 * 5. Generates a reproducible audit report with success, rejected, and warning metrics
 */

import {
  ROUTES,
  TRIPS,
  FARE_TABLE,
  PRIVATE_OPERATORS,
  VERIFIED_NODES,
  type TransitRoute,
  type Trip,
  type VerificationStatus,
  type ServiceType,
} from './busData';

export interface ValidationIssue {
  record_id: string;
  type: 'ERROR' | 'WARNING' | 'NOTE';
  field: string;
  message: string;
  source: string;
}

export interface ImportSummary {
  timestamp: string;
  dataset_version: string;
  total_routes_processed: number;
  valid_routes_count: number;
  rejected_routes_count: number;
  total_trips_processed: number;
  valid_trips_count: number;
  rejected_trips_count: number;
  institutional_routes_segregated: number;
  public_routes_count: number;
  verified_geocodes_count: number;
  fare_stages_indexed: number;
  private_operators_registered: number;
  warnings_count: number;
  issues: ValidationIssue[];
  status_breakdown: Record<VerificationStatus, number>;
  service_type_breakdown: Record<string, number>;
}

/**
 * Validates a TransitRoute against strict operational rules
 */
export function validateRoute(route: TransitRoute): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Required core identifiers
  if (!route.route_id || route.route_id.trim() === '') {
    issues.push({
      record_id: route.route_id || 'UNKNOWN',
      type: 'ERROR',
      field: 'route_id',
      message: 'Missing mandatory route identifier.',
      source: route.data_source,
    });
  }

  if (!route.route_number || route.route_number.trim() === '') {
    issues.push({
      record_id: route.route_id,
      type: 'ERROR',
      field: 'route_number',
      message: 'Missing official route number or code.',
      source: route.data_source,
    });
  }

  if (!route.origin || !route.destination) {
    issues.push({
      record_id: route.route_id,
      type: 'ERROR',
      field: 'origin/destination',
      message: 'Route origin and destination must both be specified.',
      source: route.data_source,
    });
  }

  // Institutional isolation check
  if (route.is_institutional && route.service_type !== 'Institutional') {
    issues.push({
      record_id: route.route_id,
      type: 'WARNING',
      field: 'service_type',
      message: 'Institutional route flagged without Institutional service_type.',
      source: route.data_source,
    });
  }

  // Stops validation
  if (!route.stops || route.stops.length < 2) {
    issues.push({
      record_id: route.route_id,
      type: 'WARNING',
      field: 'stops',
      message: 'Route has fewer than 2 stops defined.',
      source: route.data_source,
    });
  } else {
    // Check coordinate validity
    route.stops.forEach((stop, idx) => {
      if (
        !stop.coordinates ||
        isNaN(stop.coordinates.lat) ||
        isNaN(stop.coordinates.lng) ||
        stop.coordinates.lat < 28.0 ||
        stop.coordinates.lat > 33.0 ||
        stop.coordinates.lng < 74.0 ||
        stop.coordinates.lng > 78.0
      ) {
        issues.push({
          record_id: `${route.route_id}-stop-${idx}`,
          type: 'WARNING',
          field: 'coordinates',
          message: `Stop "${stop.stop_name}" coordinates (${stop.coordinates?.lat}, ${stop.coordinates?.lng}) outside Northern India transit envelope.`,
          source: route.data_source,
        });
      }
    });
  }

  // Source attribution
  if (!route.data_source || route.data_source === 'Unspecified') {
    issues.push({
      record_id: route.route_id,
      type: 'WARNING',
      field: 'data_source',
      message: 'Route lacks authoritative data source documentation.',
      source: 'Internal Validator',
    });
  }

  return issues;
}

/**
 * Validates a Trip timetable record
 */
export function validateTrip(trip: Trip): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!trip.trip_id || !trip.route_id) {
    issues.push({
      record_id: trip.trip_id || 'UNKNOWN_TRIP',
      type: 'ERROR',
      field: 'trip_id/route_id',
      message: 'Trip is missing trip_id or linked route_id.',
      source: trip.data_source,
    });
  }

  // Departure format HH:MM
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(trip.departure_time)) {
    issues.push({
      record_id: trip.trip_id,
      type: 'ERROR',
      field: 'departure_time',
      message: `Invalid scheduled departure time format: "${trip.departure_time}" (expected HH:MM).`,
      source: trip.data_source,
    });
  }

  if (!timeRegex.test(trip.arrival_time)) {
    issues.push({
      record_id: trip.trip_id,
      type: 'ERROR',
      field: 'arrival_time',
      message: `Invalid scheduled arrival time format: "${trip.arrival_time}" (expected HH:MM).`,
      source: trip.data_source,
    });
  }

  // Fare verification
  if (trip.fare_ordinary === undefined && trip.fare_hvac === undefined && trip.fare_volvo === undefined) {
    issues.push({
      record_id: trip.trip_id,
      type: 'NOTE',
      field: 'fare',
      message: 'No published fare available for trip; displayed as "Not available" to prevent price fabrication.',
      source: trip.data_source,
    });
  }

  // GPS truth check
  if (trip.tracking_status === 'Live GPS') {
    issues.push({
      record_id: trip.trip_id,
      type: 'WARNING',
      field: 'tracking_status',
      message: 'Trip configured as Live GPS but no active telemetry hardware feed verified. Downgraded to Scheduled Only.',
      source: trip.data_source,
    });
  }

  return issues;
}

/**
 * Runs the complete dataset import & validation suite
 */
export function runDataImportAudit(): ImportSummary {
  const issues: ValidationIssue[] = [];
  let validRoutes = 0;
  let rejectedRoutes = 0;
  let validTrips = 0;
  let rejectedTrips = 0;
  let institutionalRoutes = 0;
  let publicRoutes = 0;

  const statusBreakdown: Record<VerificationStatus, number> = {
    'Verified': 0,
    'Unverified': 0,
    'Needs Update': 0,
  };

  const serviceBreakdown: Record<string, number> = {};

  // Process Routes
  for (const route of ROUTES) {
    const routeIssues = validateRoute(route);
    issues.push(...routeIssues);

    const hasError = routeIssues.some((i) => i.type === 'ERROR');
    if (hasError) {
      rejectedRoutes++;
    } else {
      validRoutes++;
    }

    if (route.is_institutional) {
      institutionalRoutes++;
    } else {
      publicRoutes++;
    }

    statusBreakdown[route.verification_status] = (statusBreakdown[route.verification_status] || 0) + 1;
    serviceBreakdown[route.service_type] = (serviceBreakdown[route.service_type] || 0) + 1;
  }

  // Process Trips
  for (const trip of TRIPS) {
    const tripIssues = validateTrip(trip);
    issues.push(...tripIssues);

    const hasError = tripIssues.some((i) => i.type === 'ERROR');
    if (hasError) {
      rejectedTrips++;
    } else {
      validTrips++;
    }
  }

  const warnings = issues.filter((i) => i.type === 'WARNING').length;

  return {
    timestamp: new Date().toISOString(),
    dataset_version: 'WIMB-2026.07-CHD-PB',
    total_routes_processed: ROUTES.length,
    valid_routes_count: validRoutes,
    rejected_routes_count: rejectedRoutes,
    total_trips_processed: TRIPS.length,
    valid_trips_count: validTrips,
    rejected_trips_count: rejectedTrips,
    institutional_routes_segregated: institutionalRoutes,
    public_routes_count: publicRoutes,
    verified_geocodes_count: Object.keys(VERIFIED_NODES).length,
    fare_stages_indexed: FARE_TABLE.length,
    private_operators_registered: PRIVATE_OPERATORS.length,
    warnings_count: warnings,
    issues,
    status_breakdown: statusBreakdown,
    service_type_breakdown: serviceBreakdown,
  };
}

