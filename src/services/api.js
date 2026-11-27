
import axios from "axios";

import {
    obtenerToken,
    cerrarSesion
} from "./sessionService";


// Configuracion principal de Axios
const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL,
    timeout: 30000

});


// Identificar solicitudes publicas de autenticacion
const esRutaAuth = (url = "") => {

    return (
        url === "/api/v1/auth/login" ||
        url === "/api/v1/auth/registro"
    );
};


// Interceptor de solicitudes
api.interceptors.request.use(

    (config) => {

        const token = obtenerToken();

        // Agregar JWT excepto en login y registro
        if (token && !esRutaAuth(config.url)) {

            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {

        return Promise.reject(error);
    }
);


// Interceptor de respuestas
api.interceptors.response.use(

    (respuesta) => {

        return respuesta;
    },

    (error) => {

        const estado = error.response?.status;
        const ruta = error.config?.url;

        // Eliminar la sesion si el backend rechaza el token
        if (estado === 401 && !esRutaAuth(ruta)) {

            cerrarSesion();

            // Notificar a React que la sesion finalizo
            window.dispatchEvent(
                new Event("isaflor:sesion-expirada")
            );
        }

        return Promise.reject(error);
    }
);


export default api;
