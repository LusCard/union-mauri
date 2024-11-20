import { useState } from "react";
import { Music, Heart, Palette, Users } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendRequest } from "../api/requests";
import Map from "../components/Map";
import { useDropzone } from "react-dropzone";
import { AiOutlineHome } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) =>
      setMediaFiles({
        photos: acceptedFiles.filter((file) => file.type.startsWith("image")),
        videos: acceptedFiles.filter((file) => file.type.startsWith("video")),
      }),
    accept: "image/*,video/*",
    multiple: true,
  });

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

    const loadingToast = toast.loading("Enviando petición...");

    try {
      setLoading(true);
      const response = await sendRequest(submissionData);
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
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 relative">
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

      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Enviar Petición
      </h1>

      <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields */}
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SendRequest;
