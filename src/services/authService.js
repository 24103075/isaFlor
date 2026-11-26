
import api from "./api";

// Registrar un nuevo cliente en el backend,servicio envía información al backend mediante POST.
export const registrarCliente = async (datosCliente) => {

    const respuesta = await api.post(
        "/api/v1/auth/registro",
        datosCliente
    );

    return respuesta.data;
};
