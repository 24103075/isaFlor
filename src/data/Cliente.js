
/**
 * Clase que representa a un cliente de IsaFlor.
 */
export class Cliente {
  constructor({
    id = null,
    nombre = '',
    email = '',
    rut = '',
    telefono = '',
    direccion = '',
    region = '',
    comuna = ''
  } = {}) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.rut = rut;
    this.telefono = telefono;
    this.direccion = direccion;
    this.region = region;
    this.comuna = comuna;
  }

  // Actualiza los datos personales y de envío.
  actualizarDatos(datos) {
    Object.assign(this, datos);
  }

  // Devuelve los datos del cliente.
  obtenerDatos() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      rut: this.rut,
      telefono: this.telefono,
      direccion: this.direccion,
      region: this.region,
      comuna: this.comuna
    };
  }
}
