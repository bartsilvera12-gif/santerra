"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import type { Property } from "@/lib/properties";

export default function PropertiesMap({
  items,
  activeId
}: {
  items: Property[];
  activeId?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, LeafletMarker>>(new Map());

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      // Load Leaflet CSS on demand (avoids global CSS import in Next.js)
      if (typeof document !== "undefined" && !document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
        link.crossOrigin = "";
        document.head.appendChild(link);
      }

      if (cancelled || !containerRef.current) return;

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current, {
          zoomControl: true,
          scrollWheelZoom: false,
          attributionControl: true
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap"
        }).addTo(mapRef.current);
      }

      const map = mapRef.current!;

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();

      const bounds: [number, number][] = [];

      items.forEach((p) => {
        const isActive = p.id === activeId;
        const icon = L.divIcon({
          className: "santerra-marker",
          html: `
            <div class="sm-pin ${isActive ? "sm-active" : ""}">
              <div class="sm-pin-body">
                <span class="sm-pin-label">${p.operation === "VENTA" ? "V" : "A"}</span>
              </div>
              <div class="sm-pin-tail"></div>
            </div>
          `,
          iconSize: [32, 42],
          iconAnchor: [16, 42],
          popupAnchor: [0, -40]
        });

        const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
        marker.bindPopup(
          `
            <div class="sm-popup">
              <img src="${p.image}" alt="" />
              <div class="sm-popup-body">
                <div class="sm-popup-op">${p.operation}</div>
                <div class="sm-popup-title">${p.title}</div>
                <div class="sm-popup-meta">${p.location}</div>
                <div class="sm-popup-price">${p.price}</div>
                <a href="/propiedades/${p.id}" class="sm-popup-link">Ver propiedad →</a>
              </div>
            </div>
          `,
          { maxWidth: 260, minWidth: 240, closeButton: false }
        );

        markersRef.current.set(p.id, marker);
        bounds.push([p.lat, p.lng]);
      });

      if (bounds.length === 1) {
        map.setView(bounds[0], 13);
      } else if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      } else {
        map.setView([-25.2833, -57.3], 7);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [items, activeId]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="w-full aspect-[16/9] md:aspect-[21/9] bg-santerra-gray border border-santerra-gray-line"
        aria-label="Mapa de propiedades"
      />
      <style jsx global>{`
        .santerra-marker { background: transparent !important; border: 0 !important; }
        .sm-pin {
          position: relative;
          width: 32px;
          height: 42px;
          transform-origin: bottom center;
          transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sm-pin:hover { transform: scale(1.1); }
        .sm-pin.sm-active { transform: scale(1.15); }
        .sm-pin-body {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #C52A42;
          border: 2px solid #fff;
          box-shadow: 0 6px 14px -4px rgba(197, 42, 66, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sm-pin.sm-active .sm-pin-body { background: #151C23; }
        .sm-pin-label {
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          font-family: var(--font-sans), Arial, sans-serif;
        }
        .sm-pin-tail {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 10px solid #C52A42;
        }
        .sm-pin.sm-active .sm-pin-tail { border-top-color: #151C23; }

        .leaflet-container {
          font-family: var(--font-sans), Arial, sans-serif;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 0;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 18px 40px -14px rgba(10, 14, 18, 0.35);
        }
        .leaflet-popup-content { margin: 0; width: 240px !important; }
        .leaflet-popup-tip { background: #fff; }
        .sm-popup img { width: 100%; height: 120px; object-fit: cover; display: block; }
        .sm-popup-body { padding: 12px 14px 14px; }
        .sm-popup-op {
          font-size: 10px; letter-spacing: 0.22em; color: #C52A42; font-weight: 700;
          text-transform: uppercase; margin-bottom: 4px;
        }
        .sm-popup-title {
          font-family: var(--font-display), Georgia, serif;
          font-size: 15px; line-height: 1.2; color: #151C23; font-weight: 700;
        }
        .sm-popup-meta { font-size: 11px; color: #6B7580; margin-top: 4px; }
        .sm-popup-price { font-size: 13px; color: #C52A42; font-weight: 600; margin-top: 6px; }
        .sm-popup-link {
          display: inline-block; margin-top: 8px; font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; color: #151C23; border-bottom: 2px solid #C52A42;
          padding-bottom: 2px; transition: color 200ms;
        }
        .sm-popup-link:hover { color: #C52A42; }
      `}</style>
    </>
  );
}
