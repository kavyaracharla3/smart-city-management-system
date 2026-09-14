import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

// Fix default Leaflet icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Colored HTML Pin Generators
const createCustomIcon = (color, labelSymbol = '') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 0 12px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: bold;
        font-size: 11px;
      ">
        ${labelSymbol}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

export const CityMap = ({
  center = [17.4401, 78.3489], // Hyderabad center
  zoom = 12,
  trafficData = [],
  wasteData = [],
  leakData = [],
  emergencyData = [],
  pollutionData = [],
  height = '450px',
}) => {
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1. Render Traffic Markers */}
        {trafficData.map((t) => {
          let color = '#10b981'; // Green for Low
          if (t.congestion_level === 'Moderate') color = '#eab308'; // Yellow
          if (t.congestion_level === 'Heavy') color = '#f43f5e'; // Red

          return (
            <Marker key={`traffic-${t.id}`} position={[t.lat, t.lng]} icon={createCustomIcon(color, '🚗')}>
              <Popup>
                <div className="text-xs">
                  <div className="font-bold text-slate-100 mb-1">{t.road_name}</div>
                  <div className="text-slate-300">Zone: <span className="font-semibold text-cyan-400">{t.city_zone}</span></div>
                  <div className="text-slate-300">Speed: <span className="font-semibold">{t.average_speed} km/h</span></div>
                  <div className="text-slate-300">Vehicles: <span className="font-semibold">{t.vehicle_count}</span></div>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.congestion_level === 'Heavy' ? 'bg-rose-500/20 text-rose-400' :
                      t.congestion_level === 'Moderate' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {t.congestion_level} Congestion
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 2. Render Waste Bins Markers */}
        {wasteData.map((b) => {
          let color = '#3b82f6';
          if (b.fill_level >= 85) color = '#f59e0b';
          if (b.fill_level >= 95) color = '#ef4444';

          return (
            <Marker key={`waste-${b.id}`} position={[b.lat, b.lng]} icon={createCustomIcon(color, '🗑️')}>
              <Popup>
                <div className="text-xs">
                  <div className="font-bold text-slate-100 mb-1">{b.bin_code}</div>
                  <div className="text-slate-300">{b.location}</div>
                  <div className="text-slate-300">Fill Level: <span className="font-bold text-cyan-400">{b.fill_level}%</span></div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div
                      className={`h-full ${b.fill_level >= 85 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                      style={{ width: `${b.fill_level}%` }}
                    />
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 3. Render Water Leak Markers */}
        {leakData.map((l) => (
          <Marker key={`leak-${l.id}`} position={[l.lat, l.lng]} icon={createCustomIcon('#06b6d4', '💧')}>
            <Popup>
              <div className="text-xs">
                <div className="font-bold text-cyan-400 mb-1">{l.leak_code} - Leak Detected</div>
                <div className="text-slate-300">{l.location}</div>
                <div className="text-slate-300">Water Loss: <span className="font-semibold text-rose-400">{l.estimated_loss_lph} L/h</span></div>
                <div className="mt-1 font-semibold text-amber-400 capitalize">Status: {l.status}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 4. Render Emergency Markers */}
        {emergencyData.map((e) => (
          <React.Fragment key={`emerg-${e.id}`}>
            <Marker position={[e.lat, e.lng]} icon={createCustomIcon('#f43f5e', '🚨')}>
              <Popup>
                <div className="text-xs">
                  <div className="font-bold text-rose-400 mb-1">{e.emergency_type} Alert</div>
                  <div className="text-slate-200">{e.location}</div>
                  <p className="text-slate-400 mt-1">{e.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                      {e.severity} Severity
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{e.status}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
            {e.severity === 'Critical' && (
              <Circle
                center={[e.lat, e.lng]}
                radius={600}
                pathOptions={{ color: '#f43f5e', fillColor: '#f43f5e', fillOpacity: 0.2 }}
              />
            )}
          </React.Fragment>
        ))}

        {/* 5. Render Pollution Stations */}
        {pollutionData.map((p) => {
          let color = '#10b981';
          if (p.aqi > 100) color = '#eab308';
          if (p.aqi > 150) color = '#f97316';
          if (p.aqi > 200) color = '#ef4444';

          return (
            <Marker key={`poll-${p.id}`} position={[p.lat, p.lng]} icon={createCustomIcon(color, '💨')}>
              <Popup>
                <div className="text-xs">
                  <div className="font-bold text-slate-100 mb-1">{p.station_name}</div>
                  <div className="text-slate-300">AQI Index: <span className="font-extrabold text-cyan-400">{p.aqi}</span></div>
                  <div className="text-slate-300">PM2.5: {p.pm25} µg/m³</div>
                  <div className="text-slate-300">PM10: {p.pm10} µg/m³</div>
                  <div className="mt-1 font-bold" style={{ color }}>{p.status}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
