// routes/experieceRoutes.js

const express = require("express");
const router = express.Router();
const {
  createExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");


// Crear experiencia

router.post("/", createExperience);


// Obtener todas las experiencias

router.get("/", getExperiences);


// Obtener una experiencia por ID

router.get("/:id", getExperienceById);


// Editar experiencia

router.put("/:id", updateExperience);


// Eliminar experiencia

router.delete("/:id", deleteExperience);

module.exports = router