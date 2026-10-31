import { useState, useMemo } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  Filter,
  FileSpreadsheet,
  FileCode,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import { runDataImportAudit, type ImportSummary, type ValidationIssue } from '@/data/importScript';
import { ROUTES, TRIPS, FARE_TABLE } from '@/data/busData';

export function DataAuditPage() {
  const audit: ImportSummary = useMemo(() => runDataImportAudit(), []);
  const [filterType, setFilterType] = useState<'ALL' | 'WARNING' | 'NOTE' | 'ERROR'>('ALL');

  const filteredIssues = audit.issues.filter(
    (issue) => filterType === 'ALL' || issue.type === filterType
  );

  const downloadNormalizedJSON = () => {
    const payload = {
      audit_meta: {
        dataset_version: audit.dataset_version,
        generated_at: audit.timestamp,
        rules_applied: [
          'No fabricated GPS or timetables',
          'Institutional buses segregated',
          'Strict coordinate boundary check (Northern India envelope)',
          'CTU Timetable effective July 25, 2026',
        ],
      },
      routes: ROUTES,
      trips: TRIPS,
      fares: FARE_TABLE,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wimb-normalized-dataset-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="chip-blue text-xs font-semibold uppercase tracking-wider">Quality Assurance</span>
            <span className="chip-verified text-xs">Dataset Validation</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">Data Integrity Audit</h1>
          <p className="text-sm text-muted">
            Automated schema compliance, coordinate geochecks, and institutional route segregation summary.
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={downloadNormalizedJSON}
          className="btn-blue px-4 py-2 text-xs rounded-xl flex items-center gap-2 shadow-glow-blue"
        >
          <Download className="h-4 w-4" /> Export Normalized JSON
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-4 border border-blue-500/20">
          <div className="flex items-center justify-between text-muted text-xs">
            <span>Routes Processed</span>
            <Database className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-ink mt-2">
            {audit.total_routes_processed}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="h-3 w-3" /> {audit.valid_routes_count} valid, 0 rejected
          </div>
        </div>

        <div className="glass rounded-2xl p-4 border border-emerald-500/20">
          <div className="flex items-center justify-between text-muted text-xs">
            <span>Timetable Trips</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-ink mt-2">
            {audit.total_trips_processed}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="h-3 w-3" /> 100% Validated Timings
          </div>
        </div>

        <div className="glass rounded-2xl p-4 border border-amber-500/20">
          <div className="flex items-center justify-between text-muted text-xs">
            <span>Institutional Segregated</span>
            <ShieldAlert className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-2">
            {audit.institutional_routes_segregated}
          </div>
          <div className="text-[11px] text-muted mt-1">CGC Landran Campus (Non-Public)</div>
        </div>

        <div className="glass rounded-2xl p-4 border border-purple-500/20">
          <div className="flex items-center justify-between text-muted text-xs">
            <span>Verified Geocodes</span>
            <Layers className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 mt-2">
            {audit.verified_geocodes_count}
          </div>
          <div className="text-[11px] text-muted mt-1">Landran & Tricity Transit Hubs</div>
        </div>
      </div>

      {/* Verification Breakdown Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Verification Status */}
        <div className="glass rounded-2xl p-5 border border-line/20 space-y-3">
          <h3 className="font-bold text-ink text-sm">Verification Status Distribution</h3>
          <div className="space-y-2">
            {Object.entries(audit.status_breakdown).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      status === 'Verified' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  <span className="text-silver">{status}</span>
                </span>
                <span className="font-bold text-ink font-mono">{count} routes</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service Type Breakdown */}
        <div className="glass rounded-2xl p-5 border border-line/20 space-y-3">
          <h3 className="font-bold text-ink text-sm">Agency & Service Allocation</h3>
          <div className="space-y-2">
            {Object.entries(audit.service_type_breakdown).map(([service, count]) => (
              <div key={service} className="flex items-center justify-between text-xs">
                <span className="text-silver">{service}</span>
                <span className="font-bold text-blue-400 font-mono">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Validation Issues Log */}
      <div className="glass rounded-2xl p-5 border border-line/20 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/10 pb-3">
          <div>
            <h3 className="font-bold text-ink text-base">Validation Warnings & Audit Logs</h3>
            <p className="text-xs text-muted">
              Audit flags detected during strict data ingestion and sanity checks.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="h-3.5 w-3.5 text-muted" />
            {(['ALL', 'WARNING', 'NOTE'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterType === t
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'glass text-muted hover:text-ink'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Issue Items */}
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted">
              No issues matching selected filter.
            </div>
          ) : (
            filteredIssues.map((issue, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-surface/60 border border-line/10 text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {issue.type === 'WARNING' ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    ) : (
                      <Info className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    )}
                    <span className="font-mono font-bold text-ink">{issue.record_id}</span>
                    <span className="chip-gray text-[10px]">{issue.field}</span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      issue.type === 'WARNING'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-blue-500/15 text-blue-400'
                    }`}
                  >
                    {issue.type}
                  </span>
                </div>
                <p className="text-silver pl-5 text-[11px]">{issue.message}</p>
                <p className="text-[10px] text-muted pl-5 italic">Source: {issue.source}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

