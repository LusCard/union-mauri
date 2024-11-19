import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import {
  fetchAllPublications,
  fetchPublicationsByCategory,
} from "../api/publish";

// Main HomeUser component
const HomeUser = () => {
  // State hooks for publications and filtering
  const [publications, setPublications] = useState([]);
  const [loadingPublications, setLoadingPublications] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const navigate = useNavigate();

  // Category data can be moved to a separate file or context if shared elsewhere
  const categories = [
    { id: "musical", name: "Eventos Musicales", icon: "🎵" },
    { id: "charity", name: "Eventos Caritativos", icon: "💝" },
    { id: "cultural", name: "Eventos Culturales", icon: "🎨" },
    { id: "social", name: "Eventos Sociales", icon: "🎉" },
  ];

  // Fetch publications when component mounts or category changes
  useEffect(() => {
    fetchPublications();
  }, []);

  // Function to fetch publications based on the selected category
  const fetchPublications = async (category = "all") => {
    setLoadingPublications(true);
    try {
      const data =
        category === "all"
          ? await fetchAllPublications() // Fetch all publications
          : await fetchPublicationsByCategory(category); // Fetch by category
      setPublications(data);
    } catch (error) {
      toast.error("Error al cargar publicaciones"); // Error handling
    } finally {
      setLoadingPublications(false);
    }
  };

  // Handle category change and fetch publications
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchPublications(category);
  };

  // Filter and sort publications based on selected category
  const filteredPublications =
    selectedCategory === "all"
      ? publications
      : publications.filter((pub) => pub.category === selectedCategory);

  // Sort publications from newest to oldest
  const sortedPublications = filteredPublications.sort(
    (a, b) => new Date(b.startDates) - new Date(a.startDates)
  );

  // Get top 5 popular events (mock data)
  const popularEvents = publications.slice(0, 5).reverse();

  // Filter upcoming events
  const now = new Date();
  const upcomingEvents = publications
    .filter((pub) => {
      const endDate = new Date(pub.endDates);
      return endDate >= now;
    })
    .sort((a, b) => new Date(a.endDates) - new Date(b.endDates));

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Banner Section - Modularize to Banner Component */}
      <div className="bg-purple-600 text-white text-center py-4 mb-6">
        <h1 className="text-4xl font-bold">Bienvenido a ViewsEvents</h1>
        <p className="mt-2">Descubre los mejores eventos en tu área</p>
      </div>

      <div className="container mx-auto px-4 py-8 flex justify-between">
        {/* User Profile Card - Modularize to UserCard Component */}
        <div className="w-1/4 mr-4">
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <img
              src="https://i.pinimg.com/564x/13/b4/08/13b408f0ad453542c0d8fa8e62602245.jpg"
              alt="Perfil"
              className="w-24 h-24 rounded-full bg-gray-300"
            />
            <h2 className="text-xl font-semibold mt-4">Invitado</h2>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-300"
              >
                Registrarse
              </button>
            </div>
            <p className="mt-4 text-center text-gray-500 italic text-xs">
              "Conectando personas a través de eventos increíbles."
            </p>
          </div>

          {/* Upcoming Events Card - Modularize to UpcomingEvents Component */}
          <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
            <h2 className="text-lg font-bold mb-4">Eventos por Finalizar</h2>
            <div className="flex flex-col space-y-2">
              {upcomingEvents.map((event) => {
                const endDate = new Date(event.endDates);
                const isExpired = endDate < now;
                const isAboutToExpire =
                  endDate - now <= 3 * 24 * 60 * 60 * 1000; // 3 días

                let statusColor;
                if (isExpired) {
                  statusColor = "bg-red-500"; // Expired
                } else if (isAboutToExpire) {
                  statusColor = "bg-orange-500"; // About to expire
                } else {
                  statusColor = "bg-green-500"; // Available
                }

                return (
                  <div
                    key={event._id}
                    className={`flex items-center justify-between p-2 rounded-lg ${statusColor} text-white`}
                  >
                    <span>{event.titles}</span>
                    <span className="text-xs">
                      {endDate.toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Publications List - Modularize to PublicationsList Component */}
        <div className="w-1/2">
          <h2 className="text-2xl font-bold text-center mb-6">Publicaciones</h2>
          {loadingPublications ? (
            <p className="text-center">Cargando publicaciones...</p>
          ) : (
            <div className="flex flex-col space-y-6">
              {sortedPublications.map((pub) => {
                const startDate = new Date(pub.startDates);
                const endDate = new Date(pub.endDates);
                const formattedStartDate = startDate.toLocaleDateString();
                const formattedStartTime = startDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const formattedEndDate = endDate.toLocaleDateString();
                const formattedEndTime = endDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const categoryData = categories.find(
                  (cat) => cat.id === pub.category
                );

                return (
                  <motion.div
                    key={pub._id}
                    className="bg-white shadow-lg rounded-lg p-4 relative w-full mx-auto"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Image and Category Tag */}
                    {pub.medias?.photos?.[0]?.url && (
                      <div className="relative">
                        <img
                          src={pub.medias.photos[0].url}
                          alt={pub.titles}
                          className="w-full h-60 object-cover rounded-t-lg"
                        />
                        <motion.div
                          className="absolute bottom-2 right-2 bg-blue-400/80 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md flex items-center gap-1 cursor-pointer overflow-hidden"
                          initial={{ width: "2rem" }}
                          whileHover={{ width: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="text-lg opacity-90">
                            {categoryData?.icon || "🎉"}
                          </span>
                          <span className="ml-1 whitespace-nowrap">
                            {categoryData?.name || "General"}
                          </span>
                        </motion.div>
                      </div>
                    )}

                    {/* Event Info */}
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2">{pub.titles}</h3>
                      <div className="text-sm text-gray-600">
                        <p>
                          Inicio: {formattedStartDate} {formattedStartTime}
                        </p>
                        <p>
                          Fin: {formattedEndDate} {formattedEndTime}
                        </p>
                      </div>
                      <p className="mt-2 text-gray-700 line-clamp-3">
                        {pub.descriptions}
                      </p>
                    </div>

                    {/* View More Button */}
                    <button
                      onClick={() => navigate(`/events/${pub._id}`)}
                      className="absolute bottom-4 right-4 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700"
                    >
                      Ver más
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Popular Events Card - Modularize to PopularEvents Component */}
        <div className="w-1/4 ml-4">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Eventos Populares</h2>
            <div className="flex flex-col space-y-4">
              {popularEvents.map((event) => (
                <div
                  key={event._id}
                  className="flex items-center justify-between p-2 rounded-lg bg-blue-500 text-white"
                >
                  <span>{event.titles}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeUser;
