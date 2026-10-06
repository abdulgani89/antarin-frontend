import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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

interface LocationPickerProps {
  label: string;
  initialLat: number;
  initialLng: number;
  onLocationChange: (lat: number, lng: number, address: string) => void;
  defaultAddress?: string;
}

const LocationMarker = ({ position, setPosition }: { position: L.LatLng | null, setPosition: any }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker 
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition(pos);
        },
      }}
    />
  );
};

const LocationPicker: React.FC<LocationPickerProps> = ({ label, initialLat, initialLng, onLocationChange, defaultAddress = '' }) => {
  const [position, setPosition] = useState<L.LatLng | null>(new L.LatLng(initialLat, initialLng));
  const [address, setAddress] = useState(defaultAddress);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(null);
  const mapRef = useRef(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // When position changes via map, update parent
  useEffect(() => {
    if (position) {
      onLocationChange(position.lat, position.lng, address);
    }
  }, [position, address]);

  // Get user's actual location once to bias search results
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Geolocation not allowed/failed", err)
      );
    }
  }, []);

  // Attempt reverse geocoding if position changes significantly (mocked for now, or using Nominatim)
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await response.json();
      if (data && data.display_name) {
        // Simplify the display name
        const parts = data.display_name.split(',');
        const simplified = parts.slice(0, 3).join(', ');
        setAddress(simplified);
      }
    } catch (error) {
      console.error("Geocoding failed", error);
    }
  };

  const handlePositionChange = (pos: L.LatLng) => {
    setPosition(pos);
    fetchAddress(pos.lat, pos.lng);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddress(val);
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (val.length > 3) {
      debounceRef.current = setTimeout(async () => {
        try {
          // If we have user's location, create a bounding box of ~11km around them
          let viewboxParam = '';
          if (userLoc) {
            const lon = userLoc.lng;
            const lat = userLoc.lat;
            viewboxParam = `&viewbox=${lon-0.1},${lat+0.1},${lon+0.1},${lat-0.1}&bounded=1`;
          }

          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&countrycodes=id&limit=5${viewboxParam}`);
          const data = await res.json();
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Autocomplete failed", error);
        }
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: any) => {
    const newLat = parseFloat(suggestion.lat);
    const newLng = parseFloat(suggestion.lon);
    
    // Simplify name
    const parts = suggestion.display_name.split(',');
    const simplified = parts.slice(0, 3).join(', ');
    
    setAddress(simplified);
    setPosition(new L.LatLng(newLat, newLng));
    setShowSuggestions(false);
    
    // If map is open, we need to recenter it, but react-leaflet doesn't easily let us change center dynamically without a ref or custom component.
    // Setting position state is enough to move the marker.
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div className="flex gap-2 relative">
        <div className="flex-1 relative">
          <input
            type="text"
            value={address}
            onChange={handleInputChange}
            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Cari lokasi atau geser pin di peta..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary transition-colors"
            required
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
              {suggestions.map((sug, idx) => (
                <div 
                  key={idx} 
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectSuggestion(sug);
                  }}
                  className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-0"
                >
                  <p className="text-sm font-medium text-gray-900 truncate">{sug.display_name.split(',').slice(0,2).join(', ')}</p>
                  <p className="text-xs text-gray-500 truncate">{sug.display_name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsMapOpen(!isMapOpen)}
          className={`px-4 rounded-xl flex items-center justify-center transition-colors ${isMapOpen ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          title="Buka Peta"
        >
          📍
        </button>
      </div>

      {isMapOpen && (
        <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200 mt-2 relative z-0">
          <MapContainer 
            center={[initialLat, initialLng]} 
            zoom={16} 
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={handlePositionChange} />
          </MapContainer>
          <div className="absolute top-2 right-2 z-[1000] bg-white px-3 py-1 rounded-md text-xs shadow font-medium pointer-events-none">
            Geser pin atau tap peta
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
