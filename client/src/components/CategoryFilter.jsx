const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-lg font-bold mb-4">Filtrar por Categoría</h2>
      <div className="flex flex-col space-y-2">
        <button
          onClick={() => onCategoryChange("all")}
          className={`p-2 rounded-lg ${
            selectedCategory === "all"
              ? "bg-purple-500 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          Todos
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`p-2 rounded-lg ${
              selectedCategory === category.id
                ? "bg-purple-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {category.name} {category.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
