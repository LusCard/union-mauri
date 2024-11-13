import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  fetchAllPublications,
  fetchPublicationsByCategory,
} from "../api/publish";

const FilteredPublicationsList = ({ categories }) => {
  const [loadingPublications, setLoadingPublications] = useState(false);
  const [publications, setPublications] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch publications based on selected category
  const fetchPublications = async (category = "all") => {
    setLoadingPublications(true);
    try {
      const data =
        category === "all"
          ? await fetchAllPublications()
          : await fetchPublicationsByCategory(category);
      setPublications(data);
    } catch (error) {
      toast.error("Error al cargar publicaciones");
    } finally {
      setLoadingPublications(false);
    }
  };

  // Fetch data on category change
  useEffect(() => {
    fetchPublications(selectedCategory);
  }, [selectedCategory]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      {/* Category Filter */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Filtrar por Categoría</h2>
        <div className="flex space-x-2 mt-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === category.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
          <button
            onClick={() => handleCategoryChange("all")}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Todos
          </button>
        </div>
      </div>

      {/* Publications List */}
      <div>
        {loadingPublications ? (
          <p>Cargando publicaciones...</p>
        ) : publications.length > 0 ? (
          <ul>
            {publications.map((publication) => (
              <li key={publication.id} className="mb-4 p-4 border rounded-md">
                <h3 className="text-xl font-semibold">{publication.title}</h3>
                <p>{publication.description}</p>
                <p className="text-sm text-gray-500">
                  Categoría: {publication.category}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay publicaciones disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default FilteredPublicationsList;
