import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateExperience from "./CreateExperience";
import { useRef } from "react";

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [editingExperience, setEditingExperience] = useState(null);
  const formRef = useRef(null);

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar esta experiencia?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/experiences/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Actualizar la lista sin recargar la página
      setExperiences((prev) => prev.filter((exp) => exp._id !== id));
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la experiencia");
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  if (loading) {
    return <p className="text-white p-6">Cargando experiencias...</p>;
  }

  if (error) {
    return <p className="text-red-500 p-6">{error}</p>;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-600 p-6">
        <h1 className="text-2xl text-gray-900 font-bold">
          Bienvenido, {user?.username.charAt(0).toUpperCase() + user?.username.slice(1)}!
        </h1>
        <p className="mt-2 text-white ">¿Que nueva experiencia de viaje tienes hoy?</p>

        <CreateExperience
          ref={formRef}
          onExperienceCreated={fetchExperiences}
          editingExperience={editingExperience}
          onCancelEdit={() => setEditingExperience(null)}
        />

        <div className="min-h-screen bg-gray-900 text-white p-6">
          {experiences.length === 0 ? (
            <p>No tienes experiencias aún</p>
          ) : (
            experiences.map((exp) => (
              <div key={exp._id} className="bg-gray-800 p-4 rounded mb-3">
                <h2 className="text-lg font-bold">{exp.title}</h2>
                <p className="text-sm text-gray-300">{exp.location}</p>
                <p className="mt-2">{exp.description}</p>
                <button
                  onClick={() => {
                    setEditingExperience(exp);
                    setTimeout(() => {
                      formRef.current?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="text-sm text-yellow-400 mt-2 underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="ml-2 text-red-400 hover:text-red-600"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Experiences;
