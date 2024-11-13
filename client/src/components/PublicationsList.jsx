import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PublicationsList = ({ publications, categories }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col space-y-6">
      {publications.map((pub) => {
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

        const categoryData = categories.find((cat) => cat.id === pub.category);

        return (
          <motion.div
            key={pub._id}
            className="bg-white shadow-lg rounded-lg p-4 relative w-full mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
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
                    {categoryData?.name || "Categoría"}
                  </span>
                </motion.div>
              </div>
            )}
            <h3 className="font-semibold text-lg mt-3 mb-1 text-center">
              {pub.titles}
            </h3>
            <p className="text-gray-600 text-xs text-center">
              📅 Fecha de Inicio: {formattedStartDate} - {formattedStartTime}
            </p>
            <p className="text-gray-600 text-xs text-center">
              📅 Fecha de Fin: {formattedEndDate} - {formattedEndTime}
            </p>
            <motion.button
              className="mt-4 flex items-center mx-auto px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/publication/${pub._id}`)}
            >
              Ver Detalles
            </motion.button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PublicationsList;
