import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import { Car, Bike, Bus, Navigation, Navigation2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

const VEHICLE_ICON_CMP = { car: Car, scooter: Bike, auto: Navigation, bus: Bus };
const STATUS_COLOR = {
  "running-late": "var(--color-amber)",
  "on-time": "var(--color-teal)",
  "running-early": "var(--color-green)",
};

/** Builds a Leaflet divIcon styled to match the app's design system, using a real lucide icon. */
function vehicleIcon(vehicle, active) {
  const Icon = VEHICLE_ICON_CMP[vehicle.type] || Car;
  const color = STATUS_COLOR[vehicle.status] || "var(--color-ink)";
  const size = active ? 40 : 34;

  const html = renderToStaticMarkup(
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "999px",
        background: "var(--color-paper)",
        border: `2.5px solid ${color}`,
        boxShadow: "var(--shadow-stone)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: active ? "scale(1.08)" : "scale(1)",
      }}
    >
      <Icon size={active ? 18 : 16} strokeWidth={2.25} color="var(--color-ink)" style={{ transform: `rotate(${vehicle.bearing || 0}deg)` }} />
    </div>
  );

  return L.divIcon({ html, className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
}

/** The viewer's own live position — a distinct pulsing marker. */
function meIcon() {
  const html = renderToStaticMarkup(
    <div style={{ position: "relative", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          width: 44,
          height: 44,
          borderRadius: "999px",
          background: "var(--color-teal)",
          opacity: 0.25,
        }}
        className="animate-ping"
      />
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "999px",
          background: "var(--color-teal)",
          border: "2.5px solid var(--color-paper)",
          boxShadow: "var(--shadow-stone)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Navigation2 size={14} strokeWidth={2.5} color="var(--color-paper)" />
      </div>
    </div>
  );
  return L.divIcon({ html, className: "", iconSize: [44, 44], iconAnchor: [22, 22] });
}

/** Keeps the map framing "me" + every vehicle whenever the vehicle list changes. */
function FitToMarkers({ center, vehicles }) {
  const map = useMap();

  useEffect(() => {
    const points = [[center.lat, center.lng], ...vehicles.map((v) => [v.lat, v.lng])];
    if (points.length === 1) {
      map.setView(points[0], 15);
      return;
    }
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center.lat, center.lng, vehicles.length]);

  return null;
}

/**
 * Real OpenStreetMap-tiled map (via Leaflet) — shows actual street names and
 * city context, not a stylized placeholder. Tiles are OpenStreetMap's free
 * public tile server; no API key needed, same as the geocoding/routing
 * services this app already uses.
 */
export default function LiveMapView({ center, vehicles = [], activeVehicleId, onSelectVehicle, className }) {
  const validVehicles = useMemo(
    () => vehicles.filter((v) => typeof v.lat === "number" && typeof v.lng === "number"),
    [vehicles]
  );

  if (!center) return null;

  return (
    <div className={className} style={{ position: "relative", overflow: "hidden" }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
        attributionControl
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        <FitToMarkers center={center} vehicles={validVehicles} />

        <Marker position={[center.lat, center.lng]} icon={meIcon()} zIndexOffset={1000}>
          <Tooltip direction="top" offset={[0, -20]}>You</Tooltip>
        </Marker>

        {validVehicles.map((v) => (
          <Marker
            key={v.id}
            position={[v.lat, v.lng]}
            icon={vehicleIcon(v, v.id === activeVehicleId)}
            eventHandlers={{ click: () => onSelectVehicle?.(v) }}
          >
            <Tooltip direction="top" offset={[0, -20]}>{v.label}</Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}