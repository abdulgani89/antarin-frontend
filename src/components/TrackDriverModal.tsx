import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const driverIcon = L.divIcon({
  className: 'custom-driver-icon',
  html: '<div style="background-color:#0F766E;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2);">🏍</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const destinationIcon = L.divIcon({
  className: 'custom-destination-icon',
  html: '<div style="background-color:#DC2626;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2);">📍</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

interface TrackDriverModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const STATUS_LABELS: Record<string, string> = {
  MATCHED: 'Driver diterima',
  GOING_TO_PICKUP: 'Driver menuju lokasi',
  STORE_PREPARING: 'Toko menyiapkan pesanan',
  PICKING_UP: 'Sedang dijemput',
  DELIVERING: 'Dalam pengiriman',
  COMPLETED: 'Selesai',
};

const TrackDriverModal: React.FC<TrackDriverModalProps> = ({ orderId, isOpen, onClose }) => {
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchOrder = async () => {
      try {
        const res = await api.get(`orders/${orderId}/`);
        setOrderData(res.data);
      } catch (err) {
        console.error("Failed to fetch order for tracking", err);
      }
    };
    fetchOrder();
    const interval = setInterval(fetchOrder, 3000);
    return () => clearInterval(interval);
  }, [isOpen, orderId]);

  if (!isOpen) return null;

  const driverLat = orderData?.driver_details?.current_lat ? parseFloat(orderData.driver_details.current_lat) : null;
  const driverLng = orderData?.driver_details?.current_lng ? parseFloat(orderData.driver_details.current_lng) : null;
  const destLat = orderData?.destination_lat ? parseFloat(orderData.destination_lat) : null;
  const destLng = orderData?.destination_lng ? parseFloat(orderData.destination_lng) : null;
  const centerLat = driverLat || destLat || -7.050304;
  const centerLng = driverLng || destLng || 110.395669;

  const driverName = orderData?.driver_details?.first_name || orderData?.driver_details?.username || 'Driver';
  const statusLabel = STATUS_LABELS[orderData?.status] || orderData?.status || '-';

  return (
    <div className="modal-overlay">
      <div className="modal-box max-w-lg" style={{display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-900">Lacak Driver</h3>
            <p className="text-sm text-gray-500 mt-0.5">{driverName}</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost p-2"
            style={{minHeight: 'auto'}}
            aria-label="Tutup peta"
          >
            <XIcon />
          </button>
        </div>

        {/* Map */}
        <div className="relative" style={{height: '380px', background: '#F1F5F9'}}>
          {!orderData ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="spinner mx-auto mb-2" style={{display:'block'}}></span>
                <p className="text-sm text-gray-400">Memuat peta...</p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={[centerLat, centerLng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {destLat && destLng && (
                <Marker position={[destLat, destLng]} icon={destinationIcon}>
                  <Popup>Tujuan Anda</Popup>
                </Marker>
              )}
              {driverLat && driverLng && (
                <Marker position={[driverLat, driverLng]} icon={driverIcon}>
                  <Popup>Lokasi Driver</Popup>
                </Marker>
              )}
            </MapContainer>
          )}

          {orderData && (!driverLat || !driverLng) && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000]">
              <div className="px-3 py-1.5 rounded-full text-xs bg-gray-800 text-white whitespace-nowrap">
                Lokasi driver belum tersedia
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-gray-600">Live Tracking</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Status: </span>
            <span className="font-semibold text-gray-900">{statusLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackDriverModal;
