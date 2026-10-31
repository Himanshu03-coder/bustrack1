import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Route } from '@/types';
import type { StopState } from '@/useTracking';

interface Props {
  route: Route;
  position: [number, number];
  stops: StopState[];
  currentIndex: number;
  heading: number;
}

export function BusMap({ route, position, stops, currentIndex }: Props) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const busMarkerRef = useRef<L.Marker | null>(null);
  const stopMarkersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!elRef.current || mapRef.current) return;

    const map = L.map(elRef.current, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: true,
    });
    mapRef.current = map;

    const bounds = L.latLngBounds(route.stops.map((s) => [s.lat, s.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40] });

    // Dark glass-style tile layer (CARTO dark, free / OSM-based)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    // route line (gold)
    const line = L.polyline(
      route.stops.map((s) => [s.lat, s.lng] as [number, number]),
      { color: '#E0B66B', weight: 3, opacity: 0.75, dashArray: '6 8', lineCap: 'round' },
    ).addTo(map);

    stops.forEach((st, i) => {
      const cls = i < currentIndex ? 'reached' : i === currentIndex ? 'current' : '';
      const icon = L.divIcon({
        className: '',
        html: `<div class="stop-marker ${cls}" style="width:14px;height:14px"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      const m = L.marker([st.stop.lat, st.stop.lng], { icon }).addTo(map);
      m.bindPopup(
        `<div style="min-width:160px"><div style="font-weight:700;font-size:13px">${st.stop.name}</div><div style="color:#92949B;font-size:11px;margin-top:2px">${format(st.stop.arrivalOffsetMin)} arr · ${format(st.stop.departureOffsetMin)} dep</div></div>`,
      );
      stopMarkersRef.current.push(m);
    });

    const busIcon = L.divIcon({
      className: '',
      html: `<div class="bus-marker" style="width:34px;height:34px"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#090A0D" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg></div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });
    busMarkerRef.current = L.marker(position, { icon: busIcon, zIndexOffset: 1000 }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      stopMarkersRef.current = [];
      busMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !busMarkerRef.current) return;
    busMarkerRef.current.setLatLng(position);
  }, [position]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.panTo(position, { animate: true, duration: 0.6 });
  }, [position]);

  return (
    <div
      ref={elRef}
      className="h-full min-h-[320px] w-full rounded-2xl"
      style={{ background: '#101114' }}
    />
  );
}

function format(min: number): string {
  const h = Math.floor((min / 60) % 24);
  const m = Math.floor(min % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
