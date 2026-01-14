// controllers/experienceControllet.js

const Experience = require("../models/Experience");

// Crear experiencia

const createExperience = async (req, res) => {
  try {

    const {title,location, description, photos,date } = req.body;
    const newExperience = new Experience({
      title,
      location,
      description,
      photos,
      date,
      createdBy: req.user.id // Asegurarse de que el middleware de autenticacion este configurado para agregar el usuario al request
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
      createdBy: req.user.id
    }
    );
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
      error: err.message
    });
  }
};





// const updateExperience = async (req, res) => {
//   try {
//     const updated = await Experience.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updated) {
//       return res.status(404).json({ message: "Experiencia no encontrada" });
//     }

//     res.json(updated);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error al actualizar experiencia", error: err.message });
//   }

//   // fin de la funcion actualizar experiencia.
// };

// Eliminar experiencia


const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experiencia no encontrada" });
    }

    // 🔐 Verificar propietario
    if (experience.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await experience.deleteOne();
    res.json({ message: "Experiencia eliminada" });
  } catch (err) {
    res.status(500).json({
      message: "Error al eliminar experiencia",
      error: err.message
    });
  }
};




// const deleteExperience = async (req, res) => {
//   try {
//     const deleted = await Experience.findByIdAndDelete(req.params.id);
//     if (!deleted) {
//       return res.status(404).json({ message: "Experiencia no encontrada" });
//     }
//     res.json({ message: "Experiencia Eliminida" });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Erro al eliminar experiencia", error: err.message });
//   }

// // fin del a funcion borrar experiencia 
// };


module.exports = {
  createExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience
}