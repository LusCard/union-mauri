import React from "react";

export const Modal = ({ pub, onClose }) => {
  if (!pub) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✖️
        </button>

        <h2 className="text-2xl font-semibold mb-2">{pub.titles}</h2>

        <p className="text-gray-700 mb-4">{pub.description}</p>

        <div className="text-gray-700 mb-4">
          <h3 className="font-semibold">Ubicaciones:</h3>
          <ul className="list-disc ml-5">
            {pub.locations.map((location, index) => (
              <li key={index}>{location}</li>
            ))}
          </ul>
        </div>

        {/* Add any other details you want to display here */}
      </div>
    </div>
  );
};
