import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllRequests, acceptRequest, denyRequest } from "../api/requests"; // Adjust API paths as needed

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getAllRequests();
        setRequests(response.data);
      } catch (error) {
        toast.error("Error al cargar las peticiones.");
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      const response = await acceptRequest(id);
      toast.success(response.data.message);
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (error) {
      toast.error("Error al aceptar la petición.");
    }
  };

  const handleDeny = async (id) => {
    try {
      const response = await denyRequest(id);
      toast.success(response.data.message);
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (error) {
      toast.error("Error al negar la petición.");
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-8">Lista de Peticiones</h1>
      {message && <p>{message}</p>}
      {requests.length === 0 ? (
        <p>No hay peticiones pendientes.</p>
      ) : (
        <ul className="w-full max-w-2xl">
          {requests.map((req) => (
            <li
              key={req._id}
              className="bg-white p-6 mb-4 rounded-lg shadow-lg"
            >
              <p>
                <strong>Usuario:</strong> {req.user}
              </p>
              <p>
                <strong>Descripción:</strong> {req.descriptions}
              </p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleAccept(req._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => handleDeny(req._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Negar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <ToastContainer />
    </div>
  );
};

export default Requests;
