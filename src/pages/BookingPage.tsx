import { useState } from 'react';
import {
  Bus,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  User,
  Phone,
  QrCode,
  AlertCircle,
  Ticket,
  ChevronRight,
  Printer,
  XCircle,
} from 'lucide-react';
import { useStore } from '@/store';
import { TRIPS, ROUTES, getRouteById, type Trip, type TransitRoute } from '@/data/busData';
import type { BookingRecord } from '@/types';

export function BookingPage() {
  const { page, go, bookings, addBooking, cancelBooking } = useStore();
  const [activeTab, setActiveTab] = useState<'book' | 'my-bookings'>('book');

  // Bookable trips from the dataset
  const bookableTrips = TRIPS.filter((t) => t.is_bookable);

  // Initial selected trip
  const currentTripId = page.name === 'booking' && page.tripId ? page.tripId : bookableTrips[0]?.trip_id;
  const [selectedTripId, setSelectedTripId] = useState<string>(currentTripId || TRIPS[0].trip_id);

  const selectedTrip = TRIPS.find((t) => t.trip_id === selectedTripId) || bookableTrips[0] || TRIPS[0];
  const selectedRoute = getRouteById(selectedTrip.route_id);

  // Seat map state (40-seat coach: 10 rows of 4: A, B aisle C, D)
  const rows = 10;
  const bookedSeed = ['2A', '2B', '5C', '7D', '8A', '8B', '9C'];
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['3B']);

  // Passenger form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [boarding, setBoarding] = useState(selectedRoute?.stops[0]?.stop_name || selectedRoute?.origin || '');
  const [dropping, setDropping] = useState(
    selectedRoute?.stops[selectedRoute.stops.length - 1]?.stop_name || selectedRoute?.destination || ''
  );
  const [formError, setFormError] = useState('');
  const [confirmedTicket, setConfirmedTicket] = useState<BookingRecord | null>(null);

  const unitFare = selectedTrip.fare_volvo || selectedTrip.fare_hvac || selectedTrip.fare_ordinary || 50;
  const totalAmount = selectedSeats.length * unitFare;

  const handleSeatClick = (seatId: string) => {
    if (bookedSeed.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= 4) {
        alert('You can select a maximum of 4 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter primary passenger name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (selectedSeats.length === 0) {
      setFormError('Please select at least 1 vacant seat.');
      return;
    }

    setFormError('');
    const newBooking = addBooking({
      tripId: selectedTrip.trip_id,
      routeNumber: selectedRoute?.route_number || 'CTU',
      operatorName: selectedTrip.operator_name,
      from: boarding || selectedRoute?.origin || 'Origin',
      to: dropping || selectedRoute?.destination || 'Destination',
      date: new Date().toISOString().split('T')[0],
      departureTime: selectedTrip.departure_time,
      arrivalTime: selectedTrip.arrival_time,
      seatNumbers: selectedSeats,
      totalFare: totalAmount,
      passengerName: name,
      passengerPhone: phone,
      boardingPoint: boarding,
    });

    setConfirmedTicket(newBooking);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="chip-blue text-xs font-semibold uppercase tracking-wider">Vacant Seat Network</span>
            <span className="chip-verified text-xs">Operator Empaneled</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">Seat Reservation</h1>
          <p className="text-sm text-muted">
            Book vacant seats on verified private operator corridors and express shuttles.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl glass p-1 border border-line/20">
          <button
            onClick={() => setActiveTab('book')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'book' ? 'bg-blue-600 text-white shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            Book Seat
          </button>
          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'my-bookings' ? 'bg-blue-600 text-white shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            <Ticket className="h-3.5 w-3.5" />
            My Bookings {bookings.length > 0 && `(${bookings.length})`}
          </button>
        </div>
      </div>

      {activeTab === 'my-bookings' ? (
        /* MY BOOKINGS TAB */
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center border border-line/20 max-w-md mx-auto space-y-3">
              <Ticket className="h-10 w-10 text-muted mx-auto stroke-[1.5]" />
              <h3 className="text-lg font-bold text-ink">No bookings found</h3>
              <p className="text-xs text-muted">
                You haven't reserved any seats yet. Discover available private operator services and book vacant seats.
              </p>
              <button
                onClick={() => setActiveTab('book')}
                className="btn-blue text-xs px-4 py-2 rounded-xl mt-2 inline-flex items-center gap-1.5"
              >
                Find Available Buses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <div
                  key={b.bookingId}
                  className={`glass rounded-2xl p-5 border space-y-4 ${
                    b.status === 'Cancelled' ? 'border-red-500/30 opacity-75' : 'border-blue-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-400">PNR: {b.pnr}</span>
                      <h3 className="font-bold text-ink text-base">
                        {b.from} → {b.to}
                      </h3>
                      <p className="text-xs text-muted">{b.operatorName} • Route {b.routeNumber}</p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        b.status === 'Confirmed' ? 'chip-verified' : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs bg-surface/60 p-3 rounded-xl border border-line/10">
                    <div>
                      <span className="text-muted block text-[10px]">DEPARTURE</span>
                      <span className="font-bold text-ink">{b.departureTime}</span>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px]">SEATS</span>
                      <span className="font-bold text-blue-400">{b.seatNumbers.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px]">TOTAL FARE</span>
                      <span className="font-bold text-emerald-400">₹{b.totalFare}</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted flex items-center justify-between pt-1">
                    <span>Passenger: {b.passengerName}</span>
                    {b.status === 'Confirmed' && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to cancel booking ${b.pnr}?`)) {
                            cancelBooking(b.pnr);
                          }
                        }}
                        className="text-red-400 hover:text-red-300 font-semibold hover:underline flex items-center gap-1"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Cancel Ticket
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : confirmedTicket ? (
        /* CONFIRMED E-TICKET VIEW */
        <div className="max-w-2xl mx-auto glass rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-line/15 pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              <div>
                <h2 className="text-lg font-extrabold text-ink">Booking Confirmed!</h2>
                <p className="text-xs text-muted">Your vacant-seat reservation has been verified.</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted block">PNR NUMBER</span>
              <span className="text-base font-mono font-bold text-blue-400">{confirmedTicket.pnr}</span>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="bg-surface/70 rounded-2xl p-5 border border-line/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted font-medium">{confirmedTicket.operatorName}</span>
                <h3 className="text-xl font-black text-ink mt-0.5">
                  {confirmedTicket.from} <span className="text-blue-400">→</span> {confirmedTicket.to}
                </h3>
              </div>
              <div className="chip-verified text-xs font-semibold">Seat Confirmed</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div>
                <span className="text-muted block text-[10px]">TRAVEL DATE</span>
                <span className="font-semibold text-ink">{confirmedTicket.date}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px]">SCHEDULED TIME</span>
                <span className="font-semibold text-ink">{confirmedTicket.departureTime}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px]">SEAT NUMBERS</span>
                <span className="font-bold text-blue-400">{confirmedTicket.seatNumbers.join(', ')}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px]">FARE PAID</span>
                <span className="font-bold text-emerald-400">₹{confirmedTicket.totalFare}</span>
              </div>
            </div>

            <div className="border-t border-line/10 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-muted">Primary Passenger: </span>
                <strong className="text-ink">{confirmedTicket.passengerName}</strong> ({confirmedTicket.passengerPhone})
              </div>
              <div>
                <span className="text-muted">Boarding At: </span>
                <strong className="text-ink">{confirmedTicket.boardingPoint}</strong>
              </div>
            </div>
          </div>

          {/* QR Code Simulation & Boarding Instructions */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-surface/40 border border-line/10">
            <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center shrink-0 shadow">
              {/* QR Code SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="0" y="0" width="30" height="30" fill="#000" />
                <rect x="5" y="5" width="20" height="20" fill="#FFF" />
                <rect x="10" y="10" width="10" height="10" fill="#000" />
                <rect x="70" y="0" width="30" height="30" fill="#000" />
                <rect x="75" y="5" width="20" height="20" fill="#FFF" />
                <rect x="80" y="10" width="10" height="10" fill="#000" />
                <rect x="0" y="70" width="30" height="30" fill="#000" />
                <rect x="5" y="75" width="20" height="20" fill="#FFF" />
                <rect x="10" y="80" width="10" height="10" fill="#000" />
                <rect x="40" y="10" width="15" height="10" fill="#000" />
                <rect x="45" y="40" width="20" height="20" fill="#000" />
                <rect x="70" y="50" width="10" height="15" fill="#000" />
                <rect x="40" y="70" width="15" height="15" fill="#000" />
                <rect x="75" y="75" width="15" height="15" fill="#000" />
              </svg>
            </div>
            <div className="text-xs text-muted space-y-1">
              <p className="font-semibold text-ink">Boarding Instructions</p>
              <p>• Show this digital pass or mention PNR {confirmedTicket.pnr} to the bus conductor upon boarding.</p>
              <p>• Arrive at {confirmedTicket.boardingPoint} 10 minutes prior to scheduled departure.</p>
              <p>• Operator Helpdesk: +91 172 2704005 / info@bustrack.in</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="btn-ghost flex-1 py-2.5 text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Printer className="h-4 w-4" /> Print / Save PDF
            </button>
            <button
              onClick={() => {
                setConfirmedTicket(null);
                setSelectedSeats(['3B']);
              }}
              className="btn-blue flex-1 py-2.5 text-xs rounded-xl flex items-center justify-center gap-2"
            >
              Book Another Seat
            </button>
          </div>
        </div>
      ) : (
        /* BOOKING WORKFLOW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Trip Selection & Seat Layout */}
          <div className="lg:col-span-7 space-y-5">
            {/* Bus Selection Pill List */}
            <div className="glass rounded-2xl p-4 border border-line/20 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted block">
                Select Bookable Service
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {bookableTrips.map((t) => {
                  const r = getRouteById(t.route_id);
                  const isSelected = t.trip_id === selectedTripId;
                  return (
                    <div
                      key={t.trip_id}
                      onClick={() => {
                        setSelectedTripId(t.trip_id);
                        if (r?.stops[0]) setBoarding(r.stops[0].stop_name);
                        if (r?.stops[r.stops.length - 1]) setDropping(r.stops[r.stops.length - 1].stop_name);
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-600/15 border-blue-500/50 shadow-sm'
                          : 'bg-surface/50 border-line/10 hover:bg-surface-elevated'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Bus className={`h-4 w-4 ${isSelected ? 'text-blue-400' : 'text-muted'}`} />
                        <div>
                          <div className="font-bold text-ink">
                            {r?.origin} → {r?.destination}
                          </div>
                          <div className="text-[11px] text-muted">
                            {t.operator_name} • {t.bus_type}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-400">{t.departure_time}</div>
                        <div className="text-[10px] text-emerald-400 font-semibold">
                          ₹{t.fare_volvo || t.fare_hvac || t.fare_ordinary || 50}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Seat Map */}
            <div className="glass rounded-2xl p-6 border border-line/20 space-y-4">
              <div className="flex items-center justify-between border-b border-line/10 pb-3">
                <div>
                  <h3 className="font-bold text-ink text-sm">Select Your Seat</h3>
                  <p className="text-xs text-muted">2x2 Executive Coach Layout</p>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-3 text-[11px] text-muted">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-surface border border-line/40 inline-block" /> Available
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-blue-600 inline-block" /> Selected
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-muted/40 inline-block" /> Occupied
                  </span>
                </div>
              </div>

              {/* Coach Container */}
              <div className="max-w-xs mx-auto border-2 border-line/30 rounded-3xl p-4 bg-surface/80 shadow-inner">
                {/* Driver Area */}
                <div className="flex justify-between items-center text-[10px] text-muted border-b border-line/20 pb-3 mb-4 px-2">
                  <span>ENTRY GATE</span>
                  <span className="font-semibold text-silver bg-surface px-2 py-0.5 rounded border border-line/20">
                    DRIVER 💺
                  </span>
                </div>

                {/* Seat Grid */}
                <div className="space-y-2.5">
                  {Array.from({ length: rows }).map((_, rIdx) => {
                    const rowNum = rIdx + 1;
                    const seats = [`${rowNum}A`, `${rowNum}B`, `${rowNum}C`, `${rowNum}D`];

                    return (
                      <div key={rowNum} className="flex items-center justify-between">
                        {/* Left pair (A, B) */}
                        <div className="flex gap-2">
                          {seats.slice(0, 2).map((seatId) => {
                            const isBooked = bookedSeed.includes(seatId);
                            const isSelected = selectedSeats.includes(seatId);

                            return (
                              <button
                                key={seatId}
                                type="button"
                                disabled={isBooked}
                                onClick={() => handleSeatClick(seatId)}
                                className={`w-8 h-8 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all ${
                                  isBooked
                                    ? 'bg-muted/20 text-muted/40 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-blue-600 text-white shadow-glow-blue scale-105'
                                    : 'bg-surface hover:bg-blue-500/20 text-ink border border-line/30'
                                }`}
                              >
                                {seatId}
                              </button>
                            );
                          })}
                        </div>

                        {/* Aisle Spacer */}
                        <span className="text-[9px] text-muted font-mono">{rowNum}</span>

                        {/* Right pair (C, D) */}
                        <div className="flex gap-2">
                          {seats.slice(2, 4).map((seatId) => {
                            const isBooked = bookedSeed.includes(seatId);
                            const isSelected = selectedSeats.includes(seatId);

                            return (
                              <button
                                key={seatId}
                                type="button"
                                disabled={isBooked}
                                onClick={() => handleSeatClick(seatId)}
                                className={`w-8 h-8 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all ${
                                  isBooked
                                    ? 'bg-muted/20 text-muted/40 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-blue-600 text-white shadow-glow-blue scale-105'
                                    : 'bg-surface hover:bg-blue-500/20 text-ink border border-line/30'
                                }`}
                              >
                                {seatId}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Passenger Details & Summary */}
          <div className="lg:col-span-5 space-y-4">
            <form onSubmit={handleConfirmBooking} className="glass rounded-2xl p-6 border border-line/20 space-y-4">
              <h3 className="font-bold text-ink text-base">Passenger Details</h3>

              {formError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-muted block mb-1 font-medium">Passenger Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jaspreet Singh"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-surface rounded-xl border border-line/20 text-ink placeholder:text-muted focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-muted block mb-1 font-medium">Mobile Number (for SMS & updates) *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-surface rounded-xl border border-line/20 text-ink placeholder:text-muted focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-muted block mb-1 font-medium">Boarding Point</label>
                    <input
                      type="text"
                      value={boarding}
                      onChange={(e) => setBoarding(e.target.value)}
                      className="w-full px-3 py-2 bg-surface rounded-xl border border-line/20 text-ink text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-muted block mb-1 font-medium">Dropping Point</label>
                    <input
                      type="text"
                      value={dropping}
                      onChange={(e) => setDropping(e.target.value)}
                      className="w-full px-3 py-2 bg-surface rounded-xl border border-line/20 text-ink text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Fare Breakdown */}
              <div className="border-t border-line/15 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Selected Seats ({selectedSeats.length})</span>
                  <span className="font-semibold text-ink">{selectedSeats.join(', ') || 'None'}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Base Fare (per seat)</span>
                  <span>₹{unitFare}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Convenience Fee</span>
                  <span className="text-emerald-400 font-semibold">FREE (Demo)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-ink border-t border-line/10 pt-2">
                  <span>Total Payable</span>
                  <span className="text-emerald-400">₹{totalAmount}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={selectedSeats.length === 0}
                className="btn-blue w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-glow-blue disabled:opacity-50"
              >
                Confirm & Reserve Seat(s) <ChevronRight className="h-4 w-4" />
              </button>

              <p className="text-[11px] text-muted text-center">
                Instant confirmation • No pre-payment required for demonstration
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

