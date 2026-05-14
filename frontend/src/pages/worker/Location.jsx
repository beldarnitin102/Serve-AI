import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useAuth } from '../../context/AuthContext';
import { workerAPI } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { MapPin, Navigation, Save, Loader, Radio } from 'lucide-react';
import { emitLocationUpdate } from '../../sockets/socket';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationSelector = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng);
    },
  });
  return null;
};

const WorkerLocation = () => {
  const { user, updateWorkerProfile } = useAuth();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  // Default location (Delhi, India)
  const defaultLocation = [28.6139, 77.2090];

  useEffect(() => {
    // Get current location from user data or browser geolocation
    if (user?.worker?.location?.coordinates) {
      const { lat, lng } = user.worker.location.coordinates;
      setCurrentLocation([lat, lng]);
      setSelectedLocation([lat, lng]);
    } else {
      // Try to get browser location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation([latitude, longitude]);
            setSelectedLocation([latitude, longitude]);
          },
          (error) => {
            console.log('Geolocation error:', error);
            setCurrentLocation(defaultLocation);
            setSelectedLocation(defaultLocation);
          }
        );
      } else {
        setCurrentLocation(defaultLocation);
        setSelectedLocation(defaultLocation);
      }
    }
  }, [user]);

  const handleLocationSelect = (latlng) => {
    setSelectedLocation([latlng.lat, latlng.lng]);
  };

  const handleGetCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation([latitude, longitude]);
          setLoading(false);
        },
        (error) => {
          console.log('Geolocation error:', error);
          setMessage('Unable to get current location. Please allow location access.');
          setLoading(false);
        }
      );
    } else {
      setMessage('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  const [isLiveTracking, setIsLiveTracking] = useState(false);

  useEffect(() => {
    let trackingInterval;
    if (isLiveTracking && navigator.geolocation) {
      trackingInterval = setInterval(() => {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          const locationData = {
            workerId: user?.worker?._id || user?._id,
            latitude,
            longitude,
            timestamp: new Date().toISOString()
          };
          emitLocationUpdate(locationData);
          setCurrentLocation([latitude, longitude]);
          setSelectedLocation([latitude, longitude]);
        });
      }, 5000); // Update every 5 seconds
    }
    return () => clearInterval(trackingInterval);
  }, [isLiveTracking, user]);

  const handleSaveLocation = async () => {
    if (!selectedLocation) return;

    setUpdating(true);
    setMessage('');

    try {
      const locationData = {
        location: {
          type: 'Point',
          coordinates: [selectedLocation[1], selectedLocation[0]], // [lng, lat]
          address: `Lat: ${selectedLocation[0].toFixed(6)}, Lng: ${selectedLocation[1].toFixed(6)}`
        }
      };

      const result = await updateWorkerProfile(locationData);
      if (result.success) {
        setMessage('Location updated successfully!');
        setCurrentLocation(selectedLocation);
      } else {
        setMessage('Failed to update location. Please try again.');
      }
    } catch (error) {
      setMessage('Error updating location. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (!currentLocation) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin" size={32} />
        <span className="ml-2">Loading map...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Update Location</h1>
        <p className="text-slate-300">
          Set your current location to receive nearby job opportunities and help customers find you.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Select Your Location</h3>
              <Button
                onClick={handleGetCurrentLocation}
                loading={loading}
                size="sm"
                variant="secondary"
              >
                <Navigation size={16} className="mr-2" />
                Use Current Location
              </Button>
            </div>

            <div className="h-96 rounded-xl overflow-hidden border border-white/10">
              <MapContainer
                center={selectedLocation || currentLocation}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {selectedLocation && (
                  <Marker position={selectedLocation}>
                    <Popup>
                      Your selected location<br />
                      Lat: {selectedLocation[0].toFixed(6)}<br />
                      Lng: {selectedLocation[1].toFixed(6)}
                    </Popup>
                  </Marker>
                )}
                <LocationSelector onLocationSelect={handleLocationSelect} />
              </MapContainer>
            </div>

            <p className="text-slate-400 text-sm mt-4">
              Click on the map to set your location, or use the "Use Current Location" button.
            </p>
          </Card>
        </div>

        {/* Location Details */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Location Details</h3>

            {selectedLocation && (
              <div className="space-y-4">
                <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-blue-400" />
                    <span className="text-sm font-medium text-slate-300">Coordinates</span>
                  </div>
                  <div className="text-white font-mono text-sm">
                    {selectedLocation[0].toFixed(6)}, {selectedLocation[1].toFixed(6)}
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-4">
                  <div className="text-sm text-slate-400 mb-1">Status</div>
                  <div className="text-green-400 font-medium">
                    {selectedLocation[0] === currentLocation[0] && selectedLocation[1] === currentLocation[1]
                      ? 'Current location set'
                      : 'Location selected - save to update'}
                  </div>
                </div>
              </div>
            )}

            {message && (
              <div className={`rounded-3xl border p-4 text-sm ${
                message.includes('successfully')
                  ? 'border-green-500/20 bg-green-500/10 text-green-200'
                  : 'border-red-500/20 bg-red-500/10 text-red-200'
              }`}>
                {message}
              </div>
            )}

            <Button
              onClick={handleSaveLocation}
              loading={updating}
              disabled={!selectedLocation || (selectedLocation[0] === currentLocation[0] && selectedLocation[1] === currentLocation[1])}
              className="w-full mt-4"
            >
              <Save size={16} className="mr-2" />
              Save Location
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Live GPS Tracking</h3>
              <div 
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isLiveTracking ? 'bg-green-500' : 'bg-slate-700'}`}
                onClick={() => setIsLiveTracking(!isLiveTracking)}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isLiveTracking ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/80 border border-white/10">
              <Radio className={`animate-pulse ${isLiveTracking ? 'text-green-500' : 'text-slate-500'}`} size={20} />
              <span className="text-sm text-slate-300">
                {isLiveTracking ? 'Currently broadcasting your location to customers.' : 'Live tracking is disabled.'}
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Location Benefits</h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Receive job notifications for nearby customers</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Customers can see your distance and ETA</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Get matched with local service opportunities</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkerLocation;
