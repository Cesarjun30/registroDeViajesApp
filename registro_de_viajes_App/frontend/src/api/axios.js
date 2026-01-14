import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// interceptor to add token to headers

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // return the config object
  return config;
});

export default api;


// Esta configuracion es para crear una instancia de axios con una URL base y un interceptor que agrega un token de autorizacion a las cabeceras de cada solicitud si el token existe en el almacenamiento local.   