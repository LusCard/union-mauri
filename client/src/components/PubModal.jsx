import React from "react";

export const Modal = ({ isOpen, onClose, children }) => {
  // If isOpen is false, return null (don't render the modal)
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // Close the modal when clicking outside of it
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
};
