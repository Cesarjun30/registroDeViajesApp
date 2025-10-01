const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require("./routes/authRoutes");
const experieceRoutes = require("./routes/experienceRoutes")

//Middleware

app.use(cors());
app.use(express.json());

// Rutas

app.use("/api/auth", authRoutes);
app.use("/api/experiences", experieceRoutes);

// Ruta de prueba

app.get("/", (req, res) => {
  res.send("Bienvenidos  la API de viajes");
});

// Conexion a MongoDB

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Error conectando a MongoDB", err));
