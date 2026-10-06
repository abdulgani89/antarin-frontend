import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Driver Icon
const driverIcon = L.divIcon({
  className: 'custom-driver-icon',
  html: '<div style="background-color: #22c55e; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🏍️</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// Custom Target Icon (Pickup/Destination)
const targetIcon = L.divIcon({
  className: 'custom-target-icon',
  html: '<div style="background-color: #ef4444; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">📍</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

interface DriverNavigateModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

const DriverNavigateModal: React.FC<DriverNavigateModalProps> = ({ order, isOpen, onClose }) => {
  const [driverPos, setDriverPos] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Simulate or get actual location of the driver continuously
    const trackLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          setDriverPos({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        }, (err) => {
          console.error("Geoloc error", err);
          // Fallback location Unnes
          setDriverPos({ lat: -7.050304, lng: 110.395669 });
        });
      } else {
        setDriverPos({ lat: -7.050304, lng: 110.395669 });
      }
    };

    trackLocation();
    const interval = setInterval(trackLocation, 5000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !order) return null;

  // Determine target based on status
  // If MATCHED / GOING_TO_PICKUP -> Target is Pickup Location
  // If PICKING_UP / DELIVERING -> Target is Destination Location
  
  const isGoingToPickup = ['MATCHED', 'GOING_TO_PICKUP'].includes(order.status);
  
  const targetLat = isGoingToPickup ? parseFloat(order.pickup_lat) : parseFloat(order.destination_lat);
  const targetLng = isGoingToPickup ? parseFloat(order.pickup_lng) : parseFloat(order.destination_lng);
  
  const targetName = isGoingToPickup ? order.pickup_location : order.destination_location;
  const stepText = isGoingToPickup ? "Menuju Lokasi Jemput/Toko" : "Mengantar ke Tujuan";

  const handleOpenGoogleMaps = () => {
    if (driverPos && targetLat && targetLng) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${driverPos.lat},${driverPos.lng}&destination=${targetLat},${targetLng}&travelmode=driving`;
      window.open(url, '_blank');
    } else if (targetLat && targetLng) {
      const url = `https://www.google.com/maps/search/?api=1&query=${targetLat},${targetLng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 md:p-0 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between shadow-sm relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white font-bold backdrop-blur-sm text-xl">
              🧭
            </div>
            <div>
              <h3 className="font-bold text-white text-lg leading-tight">Navigasi Driver</h3>
              <p className="text-white/80 text-xs font-medium">{stepText}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Map */}
        <div className="h-96 w-full relative bg-gray-100">
          <MapContainer 
            center={driverPos ? [driverPos.lat, driverPos.lng] : (targetLat ? [targetLat, targetLng] : [-7.050304, 110.395669])} 
            zoom={15} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Target Marker */}
            {targetLat && targetLng && (
              <Marker position={[targetLat, targetLng]} icon={targetIcon}>
                <Popup>{targetName}</Popup>
              </Marker>
            )}

            {/* Driver Marker */}
            {driverPos && (
              <Marker position={[driverPos.lat, driverPos.lng]} icon={driverIcon}>
                <Popup>Lokasi Anda</Popup>
              </Marker>
            )}

            {/* Polyline Route Line */}
            {driverPos && targetLat && targetLng && (
              <Polyline 
                positions={[[driverPos.lat, driverPos.lng], [targetLat, targetLng]]} 
                pathOptions={{ color: '#3b82f6', weight: 4, dashArray: '10, 10' }} 
              />
            )}
          </MapContainer>
        </div>
        
        {/* Footer Info & Action */}
        <div className="p-6 bg-white border-t border-gray-100 flex flex-col gap-4">
          <div>
            <p className="text-xs text-gray-500 font-medium">Tujuan Saat Ini:</p>
            <p className="text-gray-900 font-bold leading-tight mt-1">{targetName}</p>
          </div>
          <button 
            onClick={handleOpenGoogleMaps}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-sm transition-colors flex justify-center items-center gap-2"
          >
            <span>🗺️</span> Buka Navigasi Google Maps
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverNavigateModal;
