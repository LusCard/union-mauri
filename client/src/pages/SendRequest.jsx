import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendRequest } from "../api/requests"; // Adjust API path as needed

const SendRequest = () => {
  const [formData, setFormData] = useState({ description: "" });
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.description.trim())
      errors.description = "La descripción es requerida";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Por favor, complete todos los campos requeridos");
      return;
    }

    try {
      const response = await sendRequest(formData);
      if (response && response.message === "petición enviada con éxitos") {
        toast.success("¡Petición enviada exitosamente!");
        setFormData({ description: "" });
      } else {
        toast.error("Error al enviar la petición");
      }
    } catch (err) {
      toast.error("Error al enviar la petición");
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-8">Enviar Petición</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg"
      >
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
              validationErrors.description
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {validationErrors.description && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.description}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Enviar Petición
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SendRequest;
