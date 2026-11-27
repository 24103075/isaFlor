
import api from "./api";

// Registrar un nuevo cliente en el backend
export const registrarCliente = async (datosCliente) => {

    const respuesta = await api.post(
        "/api/v1/auth/registro",
        datosCliente
    );

    return respuesta.data;
};


// Iniciar sesion mediante JWT
export const iniciarSesion = async (correo, password) => {

    const datosLogin = {
        correo: correo.trim().toLowerCase(),
        password: password
    };

    const respuesta = await api.post(
        "/api/v1/auth/login",
        datosLogin
    );

    return respuesta.data;
};
