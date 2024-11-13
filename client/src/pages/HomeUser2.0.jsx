import React from "react";
import Banner from "../components/Banner";
import UserProfile from "../components/UserProfile";
import UpcomingEvents from "../components/UpcomingEvents";
import PopularEvents from "../components/PopularEvents";
import FilteredPublicationsList from "../components/FilteredPublicationsList";

const HomeUser = () => {
  // Define categories here and pass them to FilteredPublicationsList
  const categories = [
    { id: "musical", name: "Eventos Musicales", icon: "🎵" },
    { id: "charity", name: "Eventos Caritativos", icon: "💝" },
    { id: "cultural", name: "Eventos Culturales", icon: "🎨" },
    { id: "social", name: "Eventos Sociales", icon: "🎉" },
  ];

  return (
    <div className="container mx-auto p-4">
      <Banner />
      <div className="flex flex-wrap">
        <div className="w-full md:w-3/4">
          <UserProfile />
          <UpcomingEvents events={[]} />

          <FilteredPublicationsList categories={categories} />
        </div>
        <div className="w-1/4 ml-4">
          <PopularEvents events={[]} />
        </div>
      </div>
    </div>
  );
};

export default HomeUser;
