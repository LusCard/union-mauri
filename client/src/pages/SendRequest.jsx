import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendRequest } from "../api/requests";
import { AiOutlineHome } from "react-icons/ai";
import { motion } from "framer-motion"; // Importamos Framer Motion
import { Music, Heart, Palette, Users } from "lucide-react";
import Map from "../components/Map";

const CATEGORIES = [
  {
    id: "musical",
    label: "Evento Musical",
    icon: Music,
    color: "bg-purple-100",
  },
  {
    id: "charity",
    label: "Evento Caritativo",
    icon: Heart,
    color: "bg-pink-100",
  },
  {
    id: "cultural",
    label: "Evento Cultural",
    icon: Palette,
    color: "bg-blue-100",
  },
  { id: "social", label: "Evento Social", icon: Users, color: "bg-green-100" },
];

const SendRequest = () => {
  const [formData, setFormData] = useState({
    titles: "",
    descriptions: "",
    locations: { lat: "", long: "" },
    category: "",
    startDates: "",
    endDates: "",
    medias: { photos: [], videos: [] },
  });
  const [mediaFiles, setMediaFiles] = useState({ photos: [], videos: [] });
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!formData.titles.trim()) errors.titles = "El título es requerido";
    if (!formData.descriptions.trim())
      errors.descriptions = "La descripción es requerida";
    if (!formData.locations.lat || !formData.locations.long)
      errors.locations = "Las coordenadas son requeridas";
    if (!formData.category) errors.category = "Seleccione una categoría";
    if (!formData.startDates)
      errors.startDates = "Seleccione la fecha de inicio";
    if (!formData.endDates) errors.endDates = "Seleccione la fecha de fin";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCategorySelect = (categoryId) => {
    setFormData((prev) => ({ ...prev, category: categoryId }));
  };

  const handleMediaChange = (e) => {
    const { files, name } = e.target;
    setMediaFiles((prev) => ({ ...prev, [name]: Array.from(files) }));
  };

  const handleAddressUpdate = (lat, long) => {
    setFormData((prev) => ({ ...prev, locations: { lat, long } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Por favor, complete todos los campos requeridos");
      return;
    }

    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "locations" || key === "medias") {
        submissionData.append(key, JSON.stringify(formData[key]));
      } else {
        submissionData.append(key, formData[key]);
      }
    });

    mediaFiles.photos.forEach((file) => submissionData.append("media", file));
    mediaFiles.videos.forEach((file) => submissionData.append("media", file));
    const loadingToast = toast.loading("Subiendo publicación...");

    try {
      setLoading(true); // Activar la carga
      const response = await sendRequest(submissionData);
      console.log("This is the submision response", response);
      if (response && response.message === "petición enviada con éxitos") {
        toast.update(loadingToast, {
          render: "¡Petición enviada exitosamente!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setFormData({
          titles: "",
          descriptions: "",
          locations: { lat: "", long: "" },
          category: "",
          startDates: "",
          endDates: "",
          medias: { photos: [], videos: [] },
        });
        setMediaFiles({ photos: [], videos: [] });
      } else {
        toast.update(loadingToast, {
          render: "Error al enviar la petición",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.update(loadingToast, {
        render: "Error al enviar la petición",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false); // Desactivar la carga
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
      {/* Botón de Home con animación de Framer Motion */}
      <motion.button
        onClick={() => navigate("/home")}
        className="absolute top-6 left-6 flex items-center p-2 bg-blue-500 text-white rounded-full shadow-lg"
        whileHover={{
          scale: 1.2,
          rotate: 5,
          boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.2)",
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <AiOutlineHome className="w-5 h-5 mr-1" />
      </motion.button>

      <h1 className="text-4xl font-bold mb-8">Enviar Petición</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg"
      >
        {/* Título */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Título
          </label>
          <input
            type="text"
            name="titles"
            value={formData.titles}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
              validationErrors.titles ? "border-red-500" : "border-gray-300"
            }`}
          />
          {validationErrors.titles && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.titles}
            </p>
          )}
        </div>

        {/* Descripción */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Descripción
          </label>
          <textarea
            name="descriptions"
            value={formData.descriptions}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
              validationErrors.descriptions
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {validationErrors.descriptions && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.descriptions}
            </p>
          )}
        </div>

        {/* Mapa */}
        <div className="mb-6 h-[410px]">
          <Map setAddress={handleAddressUpdate} />
          {validationErrors.locations && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.locations}
            </p>
          )}
        </div>

        {/* Categorías */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Categoría
          </label>
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategorySelect(category.id)}
                className={`flex items-center justify-center px-4 py-2 border rounded-lg transition-all duration-300 ${
                  formData.category === category.id
                    ? "bg-indigo-200 border-indigo-500 text-indigo-900"
                    : "bg-gray-100 border-gray-300 text-gray-600"
                }`}
              >
                <category.icon className="w-5 h-5 mr-2" />
                {category.label}
              </button>
            ))}
          </div>
          {validationErrors.category && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.category}
            </p>
          )}
        </div>

        {/* Fechas */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Fechas del Evento
          </label>
          <input
            type="datetime-local"
            name="startDates"
            value={formData.startDates}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
              validationErrors.startDates ? "border-red-500" : "border-gray-300"
            }`}
          />
          {validationErrors.startDates && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.startDates}
            </p>
          )}
          <input
            type="datetime-local"
            name="endDates"
            value={formData.endDates}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
              validationErrors.endDates ? "border-red-500" : "border-gray-300"
            }`}
          />
          {validationErrors.endDates && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.endDates}
            </p>
          )}
        </div>

        {/* Carga de Archivos */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Cargar Imágenes
          </label>
          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            onChange={handleMediaChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Cargar Videos
          </label>
          <input
            type="file"
            name="videos"
            accept="video/*"
            multiple
            onChange={handleMediaChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Botón de Envío */}

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
