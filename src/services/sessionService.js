
const CLAVE_SESION = "isaflor_sesion";


// Guardar la sesion del usuario autenticado
export const guardarSesion = (datosAuth) => {

    const rol = datosAuth.usuario?.tipoUsuario?.toUpperCase();
    const duracion = Number(datosAuth.expiresIn);

    // Validar la respuesta del backend
    if (
        !datosAuth.accessToken ||
        !datosAuth.usuario ||
        !["CLIENTE", "ADMINISTRADOR"].includes(rol) ||
        !Number.isFinite(duracion) ||
        duracion <= 0
    ) {
        throw new Error("La respuesta de autenticacion no es valida");
    }

    const sesion = {
        accessToken: datosAuth.accessToken,
        tokenType: "Bearer",
        expiresAt: Date.now() + duracion * 1000,
        usuario: datosAuth.usuario,
        rol: rol
    };

    localStorage.setItem(
        CLAVE_SESION,
        JSON.stringify(sesion)
    );

    return sesion;
};


// Obtener la sesion actual
export const obtenerSesion = () => {

    try {

        const datos = localStorage.getItem(CLAVE_SESION);

        if (!datos) {
            return null;
        }

        const sesion = JSON.parse(datos);

        // Verificar que la sesion sea valida
        if (
            !sesion?.accessToken ||
            !sesion.usuario ||
            !["CLIENTE", "ADMINISTRADOR"].includes(sesion.rol) ||
            !Number.isFinite(sesion.expiresAt) ||
            Date.now() >= sesion.expiresAt
        ) {
            cerrarSesion();
            return null;
        }

        return sesion;

    } catch {

        cerrarSesion();
        return null;
    }
};


// Obtener el token JWT
export const obtenerToken = () => {

    const sesion = obtenerSesion();

    return sesion?.accessToken || null;
};


// Comprobar si existe una sesion activa
export const estaAutenticado = () => {

    return obtenerSesion() !== null;
};


// Cerrar la sesion del usuario
export const cerrarSesion = () => {

    localStorage.removeItem(CLAVE_SESION);
};
