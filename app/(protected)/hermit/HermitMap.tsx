"use client";

import { useEffect, useRef } from "react";
import type { Stop } from "./page";

export default function HermitMap({ stops }: { stops: Stop[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    if ((mapRef.current as any)._leaflet_id) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    import("leaflet").then((L) => {
      if (!mapRef.current || (mapRef.current as any)._leaflet_id) return;

      const map = L.map(mapRef.current).setView([50.938, 6.96], 15);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      stops.forEach((stop) => {
        const label = stop.isFinal ? "★" : String(stop.roundNumber);
        const bg = stop.isFinal ? "#1e293b" : "#f59e0b";

        const icon = L.divIcon({
          html: `<div style="background:${bg};color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white;">${label}</div>`,
          className: "",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -20],
        });

        L.marker([stop.lat, stop.lng], { icon })
          .addTo(map)
          .bindPopup(`<strong>${stop.pubName}</strong><br/><span style="font-size:12px;color:#94a3b8">${stop.roundName}</span>`);
      });

      if (stops.length > 0) {
        const bounds = L.latLngBounds(stops.map((s) => [s.lat, s.lng]));
        map.fitBounds(bounds, { padding: [48, 48] });
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div
        ref={mapRef}
        className="w-full rounded-2xl overflow-hidden mb-6"
        style={{ height: "320px" }}
      />

      <div className="flex flex-col gap-3">
        {stops.map((stop) => (
          <a
            key={stop.roundNumber}
            href={`https://maps.google.com/maps?q=${stop.lat},${stop.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 active:bg-slate-50 transition-colors"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm"
              style={{ background: stop.isFinal ? "#1e293b" : "#f59e0b" }}
            >
              {stop.isFinal ? "★" : stop.roundNumber}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 leading-snug truncate">{stop.pubName}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stop.roundName}</p>
            </div>
            <svg className="w-5 h-5 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        ))}
      </div>
    </>
  );
}
