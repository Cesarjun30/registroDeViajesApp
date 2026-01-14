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
const authMiddleware = require("../middleware/authMiddleware");

// Crear experiencia

router.post("/", authMiddleware, createExperience);


// Obtener todas las experiencias

router.get("/",authMiddleware, getExperiences);


// Obtener una experiencia por ID

router.get("/:id", authMiddleware, getExperienceById);


// Editar experiencia

router.put("/:id", authMiddleware, updateExperience);


// Eliminar experiencia

router.delete("/:id", authMiddleware, deleteExperience);

module.exports = router