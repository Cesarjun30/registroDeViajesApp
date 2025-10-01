// controllers/ authcontroller.js

const User = require("../models/User");
const bcrypt = require("bcryptjs"); // para encriptar la contraseña
const jwt = require("jsonwebtoken"); // para generar token

// registro de usuario

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //verificar que no existan

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    //Encryptar contraseña

    const hashedPassword = await bcrypt.hash(password, 10);

    //Crear nuevo Usuario

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Usuario Registrado con exito" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: err.message });
  }
};



// Login de usuario

    
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Verificar contraseña

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: " Contraseña incorrecta" });
    }

    // Generar Token

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: "1h"}
    );

    res.json({ message: "Login exitoso", token });
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor", error: err.message });
  }

  // fin de la funcion
};

module.exports = {
  registerUser,
  loginUser,
};
