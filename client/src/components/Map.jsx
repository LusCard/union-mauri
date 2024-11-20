import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";

// Configurar el ícono del marcador
const customIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Reverse geocoding function using OpenStreetMap's Nominatim API
const fetchAddress = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    );
    return response.data?.display_name || "Address not found";
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Address not found";
  }
};

// eslint-disable-next-line react/prop-types
const Map = ({ setAddress }) => {
  const initialPosition = [-26.1845, -58.1854];
  const [markerPosition, setMarkerPosition] = useState(initialPosition);
  const [address, setAddressState] = useState("");

  // Function to update marker position and address
  const updateMarkerPosition = async (lat, lng) => {
    setMarkerPosition([lat, lng]);
    setAddress(lat, lng); // Pass the coordinates to the parent if needed

    // Fetch and update the address
    const fetchedAddress = await fetchAddress(lat, lng);
    setAddressState(fetchedAddress);
  };

  const LocationMarker = () => {
    useMapEvents({
      pointerdown(e) {
        const { lat, lng } = e.latlng;
        updateMarkerPosition(lat, lng);
      },
    });
    return null;
  };

  const handleMarkerDragEnd = async (e) => {
    const { lat, lng } = e.target.getLatLng();
    updateMarkerPosition(lat, lng);
  };

  return (
    <div className="w-full h-96">
      <MapContainer
        center={initialPosition}
        zoom={13} // Start with a lower zoom
        maxZoom={19} // Maintain the maximum zoom level
        style={{ height: "90%", width: "100%" }}
      >
        {/* Using OpenStreetMap tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        <LocationMarker />
        <Marker
          position={markerPosition}
          draggable={true} // Make the marker draggable
          eventHandlers={{
            dragend: handleMarkerDragEnd, // Handle when the marker is dragged
          }}
          icon={customIcon} // Use the custom icon
        />
      </MapContainer>

      {/* Display the address below the map */}
      <div className="mt-4 text-gray-700">
        <h3 className="font-semibold">Dirección:</h3>
        {/* Show a loading state or a default message until the address is available */}
        <p>{address ? address : "Cargando dirección..."}</p>
      </div>
    </div>
  );
};

export default Map;
