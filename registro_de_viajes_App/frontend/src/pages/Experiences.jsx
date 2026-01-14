import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/experiences", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setExperiences(res.data);
      } catch (error) {
        setError("No se pudieron cargar las experiencias");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return <p className="text-white p-6">Cargando experiencias...</p>;
  }

  if (error) {
    return <p className="text-red-500 p-6">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-600 p-6">
      
      <h1 className="text-2xl text-gray-900 font-bold">
        Bienvenido, {user?.username}
      </h1>
      <p className="mt-2 text-white ">Aquí irán las experiencias de viaje</p>

      
  <div className="min-h-screen bg-gray-900 text-white p-6">
    <h1 className="text-2xl mb-4">
      Bienvenido, {user?.username}
    </h1>

    {experiences.length === 0 ? (
      <p>No tienes experiencias aún</p>
    ) : (
      experiences.map((exp) => (
        <div
          key={exp._id}
          className="bg-gray-800 p-4 rounded mb-3"
        >
          <h2 className="text-lg font-bold">{exp.title}</h2>
          <p className="text-sm text-gray-300">{exp.location}</p>
          <p className="mt-2">{exp.description}</p>
        </div>
      ))
    )}
  </div>
    </div>
  );
};

export default Experiences;

// const Experiences = () => {

// };
