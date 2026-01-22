import { useState, useEffect, forwardRef } from "react";
import axios from "axios";

const CreateExperience = forwardRef(
  ({ onExperienceCreated, editingExperience, onCancelEdit }, ref) => {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Función para obtener la fecha local en formato YYYY-MM-DD
    const getTodayLocalDate = () => {
      const today = new Date();
      const offset = today.getTimezoneOffset();
      const localDate = new Date(today.getTime() - offset * 60000);
      return localDate.toISOString().split("T")[0];
    };

    useEffect(() => {
      if (editingExperience) {
        setTitle(editingExperience.title);
        setLocation(editingExperience.location);
        setDescription(editingExperience.description);
        setDate(
          editingExperience.date ? editingExperience.date.split("T")[0] : ""
        );
      }
    }, [editingExperience]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        if (editingExperience) {
          await axios.put(
            `http://localhost:5000/api/experiences/${editingExperience._id}`,
            {
              title,
              location,
              description,
              date,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          await axios.post(
            "http://localhost:5000/api/experiences",
            {
              title,
              location,
              description,
              date,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        // limpiar formulario
        setTitle("");
        setLocation("");
        setDescription("");
        setDate("");

        // avisar al padre que se creó una experiencia
        onExperienceCreated();
      } catch (err) {
        setError("No se pudo crear la experiencia");
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <form
          ref={ref}
          onSubmit={handleSubmit}
          className="bg-gray-800 p-4 rounded mb-6 my-4"
        >
          <h2 className="text-xl text-white font-bold mb-4">
            {editingExperience ? "Editar experiencia" : "Crear experiencia"}
          </h2>

          {error && <p className="text-red-400 mb-2">{error}</p>}

          <input
            type="text"
            placeholder="Título"
            className="w-full p-2 mb-2 rounded text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Ubicación"
            className="w-full p-2 mb-2 rounded text-black"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <textarea
            placeholder="Descripción"
            className="w-full p-2 mb-2 rounded text-black"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="date"
            max={getTodayLocalDate()}
            className="w-full p-2 mb-4 rounded text-black"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 px-4 py-2 rounded mx-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Guardando..."
              : editingExperience
              ? "Actualizar"
              : "Crear experiencia"}
          </button>

          {editingExperience && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-sm text-gray-400 underline mt-2 mx-2"
            >
              Cancelar edición
            </button>
          )}
        </form>
      </>
    );
  }
);

export default CreateExperience;
