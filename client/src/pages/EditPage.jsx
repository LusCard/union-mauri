import { useState, useEffect } from "react";
import { Music, Heart, Palette, Users } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updatePublication } from "../api/publish"; // Usa tu API de edición
import Map from "../components/Map";
import { useDropzone } from "react-dropzone";
import { AiOutlineHome } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

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

const EditPublication = () => {
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
  const [loading, setLoading] = useState(false);
  const { id } = useParams(); // Obtenemos el ID desde la URL
  const navigate = useNavigate();

  // Cargar los datos de la publicación
  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        setFormData({
          titles: data.titles || "",
          descriptions: data.descriptions || "",
          locations: data.locations || { lat: "", long: "" },
          category: data.category || "",
          startDates: data.startDates || "",
          endDates: data.endDates || "",
          medias: data.medias || { photos: [], videos: [] },
        });
      } catch (error) {
        toast.error("Error al cargar la publicación");
      }
    };
    fetchPublication();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "locations" || key === "medias") {
        submissionData.append(key, JSON.stringify(formData[key]));
      } else {
        submissionData.append(key, formData[key]);
      }
    });

    // Añadir archivos de medios
    mediaFiles.photos.forEach((file) => submissionData.append("media", file));
    mediaFiles.videos.forEach((file) => submissionData.append("media", file));

    try {
      setLoading(true);
      const response = await updatePublication(id, submissionData);
      if (response.message === "Publicación actualizada exitosamente") {
        toast.success("Publicación actualizada exitosamente");
        navigate("/home");
      } else {
        toast.error("Error al actualizar la publicación");
      }
    } catch (error) {
      toast.error("Error al actualizar la publicación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 relative">
      <motion.button
        onClick={() => navigate("/home")}
        className="absolute top-6 left-6 flex items-center p-2 bg-blue-500 text-white rounded-full shadow-lg"
        whileHover={{ scale: 1.2, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <AiOutlineHome className="w-5 h-5 mr-1" />
      </motion.button>

      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Editar Publicación
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6"></form>

      <ToastContainer />
    </div>
  );
};

export default EditPublication;
