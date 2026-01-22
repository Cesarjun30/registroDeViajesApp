// controllers/experienceControllet.js

const Experience = require("../models/Experience");

// funcion para obtener la fecha local de hoy en formato YYYY-MM-DD

const getTodayLocalDate = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localDate = new Date(today.getTime() - offset * 60000);
  return localDate.toISOString().split("T")[0];
};



// Crear experiencia

const createExperience = async (req, res) => {
  try {
    const { title, location, description, photos, date } = req.body;

    // evitar fecha futura
    if (date > new Date(getTodayLocalDate())) {
      return res.status(400).json({
        message: "La fecha de la experiencia no puede ser futura",
      });
    }

    const newExperience = new Experience({
      title,
      location,
      description,
      photos,
      date,
      createdBy: req.user.id, // Asegurarse de que el middleware de autenticacion este configurado para agregar el usuario al request
    });
    await newExperience.save();
    res.status(201).json(newExperience);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al crear experiencia", error: err.message });
  }

  //final de la funcion crear experiencia
};

// Obtener todas las experiencias

const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({
      createdBy: req.user.id,
    });
    res.json(experiences);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener experiencas", error: err.message });
  }

  //Fin de la funcion obtenener experiencias
};

// Obtener experiencias por ID

const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id).populate(
      "createBy",
      "username email"
    );
    if (!experience) {
      return res.status(404).json({ message: "Experiencia no encontrada" });
    }
    res.json(experience);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener experiencia", error: err.message });
  }

  // Fin del a funcion obterner experiencia por ID
};

// Actualizar experiencia

const updateExperience = async (req, res) => {
     

  
  try {

    const { date } = req.body;

 if (date && date > getTodayLocalDate()) {
      return res.status(400).json({
        message: "La fecha de la experiencia no puede ser futura",
      });
    }
    const experience = await Experience.findById(req.params.id);
   
    if (!experience) {
      return res.status(404).json({ message: "Experiencia no encontrada" });
    }
   
  
    // 🔐 Verificar que la experiencia pertenece al usuario
    if (experience.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "No autorizado" });
    }

   
    const updated = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      message: "Error al actualizar experiencia",
      error: err.message,
    });
  }
};


// Eliminar experiencia

const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experiencia no encontrada" });
    }

    // 🔐 Verificar propietario
    if (experience.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "No autorizado" });
    }

    await experience.deleteOne();

    res.json({ message: "Experiencia eliminada" });
  } catch (err) {
    res.status(500).json({
      message: "Error al eliminar experiencia",
      error: err.message,
    });
  }
};


module.exports = {
  createExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
};
