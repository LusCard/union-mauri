import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default UserProfile;
