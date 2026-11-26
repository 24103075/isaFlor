
import api from "./api";

// Obtener todas las comunas desde el backend
export const obtenerComunas = async () => {
    const respuesta = await api.get("/api/v1/comunas");
    return respuesta.data;
};
