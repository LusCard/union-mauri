import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configurar el ícono del marcador
const customIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component for the map
const Map = ({ lat, lng }) => {
  const [address, setAddress] = useState(null); // State to hold the address
  const initialPosition = [lat, lng];

  // Function to fetch address using Nominatim API
  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.address) {
        // Construct a readable address from the data
        const { road, house_number, city } = data.address;
        const readableAddress = `${house_number || ""} ${road || ""}, ${
          city || ""
        }`;
        setAddress(readableAddress);
      } else {
        setAddress("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Error fetching address");
    }
  };

  // Fetch address when the component mounts
  useEffect(() => {
    if (lat && lng) {
      fetchAddress(lat, lng);
    }
  }, [lat, lng]);

  return (
    <div>
      {/* Display the fetched address below the map */}
      <div className="mt-4">
        <h3 className="font-semibold text-lg text-center text-gray-800">
          Address:
        </h3>
        <p className="text-gray-600 text-center">
          {address || "Fetching address..."}
        </p>
      </div>
      {/* Map display */}
      <div className="w-full h-96">
        <MapContainer
          center={initialPosition}
          zoom={13}
          maxZoom={19}
          style={{ height: "75%", width: "75%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />
          <Marker position={initialPosition} icon={customIcon} />
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
