import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import UserProfile from "../components/UserProfile";
import UpcomingEvents from "../components/UpcomingEvents";
import PublicationsList from "../components/PublicationsList.jsx";
import PopularEvents from "../components/PopularEvents";
import CategoryFilter from "../components/CategoryFilter";
import {
  fetchAllPublications,
  fetchPublicationsByCategory,
} from "../api/publish.js";

const [LoadingPublications, setLoadingPublications] = useState(false);

//The categories
const categories = [
  { id: "musical", name: "Eventos Musicales", icon: "🎵" },
  { id: "charity", name: "Eventos Caritativos", icon: "💝" },
  { id: "cultural", name: "Eventos Culturales", icon: "🎨" },
  { id: "social", name: "Eventos Sociales", icon: "🎉" },
];
//The publications
// Function to fetch publications based on the selected category
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
const HomeUser = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container mx-auto p-4">
      <Banner />
      <div className="flex flex-wrap">
        <div className="w-full md:w-3/4">
          <UserProfile />
          <UpcomingEvents events={events} />
          <PublicationsList
            publications={publications}
            categories={categories}
          />
        </div>
        <div className="w-1/4 ml-4">
          <PopularEvents events={events} />
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeUser;
