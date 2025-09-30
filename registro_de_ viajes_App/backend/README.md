# 🌍 API de Experiencias de Viaje - MERN

Este proyecto es una aplicación MERN (MongoDB, Express, React, Node.js) que permite a los usuarios **compartir experiencias de viaje** con una comunidad de viajeros.

---

## 🚀 Funcionalidades

- Registro e inicio de sesión de usuarios.
- CRUD de experiencias de viaje:
  - Crear experiencia.
  - Ver todas las experiencias.
  - Ver una experiencia específica.
  - Editar experiencia.
  - Eliminar experiencia.
- Relación entre usuarios y experiencias (cada experiencia pertenece a un usuario).
- Preparada para escalar con futuras funcionalidades (comentarios, likes, etc.).

---

## 📂 Estructura del proyecto (backend)

```
/backend
│
├── index.js                # Punto de entrada del servidor
├── .env                    # Variables de entorno
│
├── /models                 # Modelos de Mongoose
│   ├── User.js
│   └── Experience.js
│
├── /controllers            # Lógica de cada recurso
│   ├── authController.js
│   └── experienceController.js
│
├── /routes                 # Definición de rutas
│   ├── authRoutes.js
│   └── experienceRoutes.js
```

---

## ⚙️ Configuración del servidor

### Dependencias
```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
npm install --save-dev nodemon
```

### Scripts en `package.json`
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

### index.js
```js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const experienceRoutes = require('./routes/experienceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/experiences', experienceRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));
```

---

## 🔑 Variables de entorno (.env)
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/viajesApp
PORT=5000
JWT_SECRET=mi_secreto_super_seguro
```

---

## 👤 Modelo: Usuario (`models/User.js`)
```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

---

## 📝 Modelo: Experiencia (`models/Experience.js`)
```js
const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  photos: [{ type: String }],
  date: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
```

---

## 🔐 Controlador de usuarios (`controllers/authController.js`)
- **Registro**
- **Login con JWT**

```js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login exitoso', token });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

module.exports = { registerUser, loginUser };
```

---

## ✈️ Controlador de experiencias (`controllers/experienceController.js`)
```js
const Experience = require('../models/Experience');

const createExperience = async (req, res) => {
  try {
    const newExperience = new Experience(req.body);
    await newExperience.save();
    res.status(201).json(newExperience);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear experiencia', error: err.message });
  }
};

const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().populate('createdBy', 'username email');
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener experiencias', error: err.message });
  }
};

const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id).populate('createdBy', 'username email');
    if (!experience) return res.status(404).json({ message: 'Experiencia no encontrada' });
    res.json(experience);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener experiencia', error: err.message });
  }
};

const updateExperience = async (req, res) => {
  try {
    const updated = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Experiencia no encontrada' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar experiencia', error: err.message });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const deleted = await Experience.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Experiencia no encontrada' });
    res.json({ message: 'Experiencia eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar experiencia', error: err.message });
  }
};

module.exports = {
  createExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience
};
```

---

## 🛣️ Rutas

### Usuarios (`routes/authRoutes.js`)
```js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
```

### Experiencias (`routes/experienceRoutes.js`)
```js
const express = require('express');
const router = express.Router();
const {
  createExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience
} = require('../controllers/experienceController');

router.post('/', createExperience);
router.get('/', getExperiences);
router.get('/:id', getExperienceById);
router.put('/:id', updateExperience);
router.delete('/:id', deleteExperience);

module.exports = router;
```

---

## 📌 Endpoints disponibles

### Auth
- `POST /api/auth/register` → Registro
- `POST /api/auth/login` → Login

### Experiencias
- `POST /api/experiences` → Crear experiencia
- `GET /api/experiences` → Listar experiencias
- `GET /api/experiences/:id` → Ver experiencia por ID
- `PUT /api/experiences/:id` → Editar experiencia
- `DELETE /api/experiences/:id` → Eliminar experiencia

---

## ✅ Próximos pasos
- Añadir middleware para proteger rutas con JWT.
- Crear el frontend con React para consumir esta API.
- Despliegue del backend y frontend.
