
// src/pages/Admin.jsx

import React, { useState, useEffect } from 'react';

import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import FormInput from '../components/molecules/FormInput';

import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  actualizarOferta
} from '../services/productoService';

import {
  obtenerCategorias
} from '../services/categoriaService';

import {
  formatearPrecio,
  tieneStockCritico,
  obtenerProductosStockBajo,
  esProductoAgotado
} from '../utils/validaciones';

import '../styles/pages/Admin.css';


// =========================================
// ESTADO INICIAL DEL FORMULARIO
// =========================================

const FORMULARIO_INICIAL = {
  codigo: '',
  nombre: '',
  descripcion: '',
  precioOriginal: '',
  stock: '',
  stockCritico: '',
  peso: '',
  pesoVolumetrico: '',
  idCategoria: ''
};


const Admin = () => {

  // Estados del inventario
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Estados de carga
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [errorCarga, setErrorCarga] = useState('');

  // Mensajes
  const [errorForm, setErrorForm] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Formulario de productos
  const [form, setForm] = useState(FORMULARIO_INICIAL);
  const [productoEditando, setProductoEditando] = useState(null);

  // Formulario de ofertas
  const [productoOferta, setProductoOferta] = useState(null);
  const [enOferta, setEnOferta] = useState(false);
  const [precioOferta, setPrecioOferta] = useState('');
  const [errorOferta, setErrorOferta] = useState('');

  const editando = productoEditando !== null;


  // =========================================
  // MANEJO DE ERRORES
  // =========================================

  const obtenerMensajeError = (error) => {

    const estado = error.response?.status;
    const datos = error.response?.data;

    if (estado === 401 || estado === 403) {
      return 'No tienes autorización para realizar esta operación. Se requiere una sesión de administrador válida.';
    }

    if (!error.response && error.request) {
      return 'No fue posible conectar con el servidor.';
    }

    if (typeof datos === 'string' && datos.trim()) {
      return datos;
    }

    if (datos?.message) {
      return datos.message;
    }

    if (datos?.mensaje) {
      return datos.mensaje;
    }

    return error.message || 'Ocurrió un error inesperado.';

  };


  // =========================================
  // CARGAR PRODUCTOS Y CATEGORÍAS
  // =========================================

  useEffect(() => {

    let activo = true;

    const cargarInventario = async () => {

      try {

        setCargando(true);
        setErrorCarga('');

        const [listaProductos, listaCategorias] =
          await Promise.all([
            obtenerProductos(),
            obtenerCategorias()
          ]);

        if (activo) {
          setProductos(listaProductos);
          setCategorias(listaCategorias);
        }

      } catch (error) {

        if (activo) {
          setErrorCarga(obtenerMensajeError(error));
        }

      } finally {

        if (activo) {
          setCargando(false);
        }

      }

    };

    cargarInventario();

    return () => {
      activo = false;
    };

  }, []);


  // =========================================
  // CAMBIOS DEL FORMULARIO
  // =========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    setErrorForm('');

  };


  // =========================================
  // VALIDAR FORMULARIO DE PRODUCTOS
  // =========================================

  const validarFormulario = () => {

    if (
      form.codigo.trim().length < 2 ||
      form.codigo.trim().length > 20
    ) {
      return 'El código debe tener entre 2 y 20 caracteres.';
    }

    if (
      form.nombre.trim().length < 2 ||
      form.nombre.trim().length > 100
    ) {
      return 'El nombre debe tener entre 2 y 100 caracteres.';
    }

    if (
      form.descripcion.trim().length < 2 ||
      form.descripcion.trim().length > 255
    ) {
      return 'La descripción debe tener entre 2 y 255 caracteres.';
    }

    if (
      !categorias.some(
        c => String(c.id) === String(form.idCategoria)
      )
    ) {
      return 'Debes seleccionar una categoría válida.';
    }

    const precio = Number(form.precioOriginal);

    if (
      form.precioOriginal === '' ||
      !Number.isInteger(precio) ||
      precio <= 0 ||
      precio > 99999999
    ) {
      return 'El precio debe ser un número entero positivo válido.';
    }

    const stock = Number(form.stock);

    if (
      form.stock === '' ||
      !Number.isInteger(stock) ||
      stock < 0 ||
      stock > 2147483647
    ) {
      return 'El stock debe ser un número entero no negativo.';
    }

    const stockCritico = Number(form.stockCritico);

    if (
      form.stockCritico === '' ||
      !Number.isInteger(stockCritico) ||
      stockCritico < 0 ||
      stockCritico > 2147483647
    ) {
      return 'El stock crítico debe ser un número entero no negativo.';
    }

    const peso = Number(form.peso);

    if (
      form.peso === '' ||
      !Number.isFinite(peso) ||
      peso < 0.01 ||
      peso > 99999999.99 ||
      !/^\d+(\.\d{1,2})?$/.test(String(form.peso))
    ) {
      return 'Debes ingresar un peso positivo con un máximo de dos decimales.';
    }

    const pesoVolumetrico = Number(form.pesoVolumetrico);

    if (
      form.pesoVolumetrico === '' ||
      !Number.isFinite(pesoVolumetrico) ||
      pesoVolumetrico < 0.01 ||
      pesoVolumetrico > 99999999.99 ||
      !/^\d+(\.\d{1,2})?$/.test(String(form.pesoVolumetrico))
    ) {
      return 'Debes ingresar un peso volumétrico positivo con un máximo de dos decimales.';
    }

    // Comprobar que el código no esté duplicado
    const codigoDuplicado = productos.some(p =>
      p.id !== productoEditando?.id &&
      p.codigo?.trim().toLowerCase() ===
        form.codigo.trim().toLowerCase()
    );

    if (codigoDuplicado) {
      return 'Ya existe un producto con ese código.';
    }

    // Conservar la oferta existente
    if (
      editando &&
      productoEditando.enOferta &&
      precio <= productoEditando.precioOferta
    ) {
      return 'El precio normal debe ser superior al precio de la oferta activa. Primero modifica la oferta.';
    }

    return '';

  };


  // =========================================
  // RESTABLECER FORMULARIO
  // =========================================

  const resetForm = () => {

    setForm(FORMULARIO_INICIAL);
    setProductoEditando(null);
    setErrorForm('');

  };


  // =========================================
  // CREAR O ACTUALIZAR PRODUCTO
  // =========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (procesando || cargando || errorCarga) {
      return;
    }

    setMensaje('');

    const error = validarFormulario();

    if (error) {
      setErrorForm(error);
      return;
    }

    try {

      setProcesando(true);
      setErrorForm('');

      if (editando) {

        const actualizado = await actualizarProducto(
          productoEditando.id,
          form
        );

        setProductos(prev =>
          prev.map(p =>
            p.id === actualizado.id
              ? actualizado
              : p
          )
        );

        setMensaje('Producto actualizado correctamente.');

      } else {

        const nuevoProducto = await crearProducto(form);

        setProductos(prev => [
          ...prev,
          nuevoProducto
        ]);

        setMensaje('Producto creado correctamente.');

      }

      resetForm();

    } catch (error) {

      setErrorForm(obtenerMensajeError(error));

    } finally {

      setProcesando(false);

    }

  };


  // =========================================
  // SELECCIONAR PRODUCTO PARA EDITAR
  // =========================================

  const handleEditar = (producto) => {

    cerrarFormularioOferta();

    setProductoEditando(producto);

    setForm({
      codigo: producto.codigo ?? '',
      nombre: producto.nombre ?? '',
      descripcion: producto.descripcion ?? '',
      precioOriginal: producto.precioOriginal ?? '',
      stock: producto.stock ?? '',
      stockCritico: producto.stockCritico ?? '',
      peso: producto.peso ?? '',
      pesoVolumetrico: producto.pesoVolumetrico ?? '',
      idCategoria: String(producto.idCategoria ?? '')
    });

    setErrorForm('');
    setMensaje('');

  };


  // =========================================
  // ELIMINAR PRODUCTO
  // =========================================

  const handleEliminar = async (producto) => {

    if (procesando) {
      return;
    }

    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar "${producto.nombre}" del inventario?`
    );

    if (!confirmar) {
      return;
    }

    try {

      setProcesando(true);
      setErrorForm('');
      setMensaje('');

      await eliminarProducto(producto.id);

      setProductos(prev =>
        prev.filter(p => p.id !== producto.id)
      );

      if (productoEditando?.id === producto.id) {
        resetForm();
      }

      if (productoOferta?.id === producto.id) {
        cerrarFormularioOferta();
      }

      setMensaje('Producto eliminado correctamente.');

    } catch (error) {

      setErrorForm(obtenerMensajeError(error));

    } finally {

      setProcesando(false);

    }

  };


  // =========================================
  // ABRIR FORMULARIO DE OFERTA
  // =========================================

  const handleGestionarOferta = (producto) => {

    resetForm();

    setProductoOferta(producto);
    setEnOferta(producto.enOferta === true);
    setPrecioOferta(producto.precioOferta ?? '');
    setErrorOferta('');
    setMensaje('');

  };


  // =========================================
  // CERRAR FORMULARIO DE OFERTA
  // =========================================

  const cerrarFormularioOferta = () => {

    setProductoOferta(null);
    setEnOferta(false);
    setPrecioOferta('');
    setErrorOferta('');

  };


  // =========================================
  // VALIDAR PRECIO DE OFERTA
  // =========================================

  const precioOfertaValido =
    productoOferta !== null &&
    precioOferta !== '' &&
    Number.isInteger(Number(precioOferta)) &&
    Number(precioOferta) > 0 &&
    Number(precioOferta) < productoOferta.precioOriginal;


  // Calcular descuento
  const porcentajeDescuento =
    enOferta && precioOfertaValido
      ? Math.round(
          (
            (productoOferta.precioOriginal - Number(precioOferta)) /
            productoOferta.precioOriginal
          ) * 100
        )
      : 0;


  // Calcular ahorro
  const ahorroOferta =
    enOferta && precioOfertaValido
      ? productoOferta.precioOriginal - Number(precioOferta)
      : 0;


  // =========================================
  // GUARDAR OFERTA
  // =========================================

  const handleGuardarOferta = async (e) => {

    e.preventDefault();

    if (!productoOferta || procesando) {
      return;
    }

    if (enOferta && !precioOfertaValido) {

      setErrorOferta(
        'El precio de oferta debe ser mayor a cero y menor al precio normal.'
      );

      return;

    }

    try {

      setProcesando(true);
      setErrorOferta('');
      setMensaje('');

      const actualizado = await actualizarOferta(
        productoOferta.id,
        enOferta,
        enOferta ? Number(precioOferta) : null
      );

      setProductos(prev =>
        prev.map(p =>
          p.id === actualizado.id
            ? actualizado
            : p
        )
      );

      setMensaje(
        enOferta
          ? 'Oferta guardada correctamente.'
          : 'Oferta desactivada correctamente.'
      );

      cerrarFormularioOferta();

    } catch (error) {

      setErrorOferta(obtenerMensajeError(error));

    } finally {

      setProcesando(false);

    }

  };


  // =========================================
  // INDICADORES DEL INVENTARIO
  // =========================================

  const productosStockBajo =
    obtenerProductosStockBajo(productos);

  const productosEnOferta =
    productos.filter(p => p.enOferta);

  const productosAgotados =
    productos.filter(p => esProductoAgotado(p));


  // =========================================
  // INTERFAZ DEL ADMINISTRADOR
  // =========================================

  return (

    <div className="admin-container container py-3">

      <h2 className="mb-2 admin-title border-bottom pb-2 fw-bold">
        Panel de Administración de Inventario
      </h2>

      <p className="text-muted mb-4">
        Gestiona los productos, las existencias y las ofertas de IsaFlor.
      </p>


      {/* ESTADO DE CARGA */}

      {cargando && (

        <div className="alert alert-info" role="status">

          <span
            className="spinner-border spinner-border-sm me-2"
            aria-hidden="true"
          />

          Cargando inventario desde Neon...

        </div>

      )}


      {/* ERROR DE CONEXIÓN */}

      {errorCarga && (

        <div className="alert alert-danger" role="alert">
          {errorCarga}
        </div>

      )}


      {/* MENSAJES DE CONFIRMACIÓN */}

      {mensaje && (

        <div className="alert alert-success alert-dismissible" role="status">

          <i className="bi bi-check-circle me-2" aria-hidden="true"></i>

          {mensaje}

          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar mensaje"
            onClick={() => setMensaje('')}
          />

        </div>

      )}


      {!cargando && !errorCarga && (

        <>

          {/* INDICADORES DEL INVENTARIO */}

          <div className="row g-3 mb-4">

            <div className="col-6 col-lg-3">
              <div className="card shadow-sm border-0 rounded-4 p-3 h-100">
                <small className="text-muted">
                  Productos registrados
                </small>
                <h3 className="fw-bold text-success mb-0">
                  {productos.length}
                </h3>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="card shadow-sm border-0 rounded-4 p-3 h-100">
                <small className="text-muted">
                  Productos en oferta
                </small>
                <h3 className="fw-bold admin-card-title mb-0">
                  {productosEnOferta.length}
                </h3>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="card shadow-sm border-0 rounded-4 p-3 h-100">
                <small className="text-muted">
                  Stock crítico
                </small>
                <h3 className="fw-bold text-warning-emphasis mb-0">
                  {productosStockBajo.length}
                </h3>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="card shadow-sm border-0 rounded-4 p-3 h-100">
                <small className="text-muted">
                  Productos agotados
                </small>
                <h3 className="fw-bold text-danger mb-0">
                  {productosAgotados.length}
                </h3>
              </div>
            </div>

          </div>


          {/* ALERTAS DE STOCK CRÍTICO */}

          {productosStockBajo.length > 0 && (

            <div className="alert alert-warning shadow-sm mb-4 border-0 rounded-3">

              <h5 className="alert-heading fw-bold mb-2">

                <i className="bi bi-exclamation-triangle me-2" aria-hidden="true"></i>

                Alertas de Stock Crítico ({productosStockBajo.length})

              </h5>

              <ul className="mb-0 small">

                {productosStockBajo.map(p => (

                  <li key={p.id}>

                    <strong>{p.nombre}</strong>

                    {' — Quedan '}

                    <strong>{p.stock}</strong>

                    {' unidades (Mínimo: '}

                    {p.stockCritico}).

                  </li>

                ))}

              </ul>

            </div>

          )}


          <div className="row g-4">

            {/* FORMULARIO ADMINISTRATIVO */}

            <div className="col-lg-4">

              <div className="card shadow-sm border-0 p-3 rounded-4">

                {productoOferta ? (

                  <>

                    {/* FORMULARIO DE OFERTAS */}

                    <h5 className="admin-card-title fw-bold mb-3">

                      <i className="bi bi-tag-fill me-2" aria-hidden="true"></i>

                      Gestionar Oferta

                    </h5>

                    <h6 className="fw-bold">
                      {productoOferta.nombre}
                    </h6>

                    <p className="text-muted small">

                      Precio normal: {' '}

                      <strong>
                        {formatearPrecio(productoOferta.precioOriginal)}
                      </strong>

                    </p>

                    {errorOferta && (

                      <div className="alert alert-danger small" role="alert">
                        {errorOferta}
                      </div>

                    )}

                    <form onSubmit={handleGuardarOferta}>

                      <fieldset disabled={procesando}>

                        <FormInput
                          type="checkbox"
                          label="Oferta activa"
                          name="enOferta"
                          checked={enOferta}
                          onChange={e => {
                            setEnOferta(e.target.checked);
                            setErrorOferta('');
                          }}
                        />

                        {enOferta && (

                          <>

                            <FormInput
                              label="Precio de oferta ($)"
                              type="number"
                              name="precioOferta"
                              value={precioOferta}
                              min="1"
                              step="1"
                              max={productoOferta.precioOriginal - 1}
                              required
                              onChange={e => {
                                setPrecioOferta(e.target.value);
                                setErrorOferta('');
                              }}
                            />

                            {precioOfertaValido ? (

                              <div className="bg-light rounded-3 p-3 mb-3">

                                <div className="d-flex justify-content-between mb-2">

                                  <span>Descuento:</span>

                                  <Badge bg="isaflor-rose">
                                    -{porcentajeDescuento}%
                                  </Badge>

                                </div>

                                <div className="d-flex justify-content-between mb-2">

                                  <span>Ahorro por unidad:</span>

                                  <strong className="text-success">
                                    {formatearPrecio(ahorroOferta)}
                                  </strong>

                                </div>

                                <hr />

                                <div className="d-flex justify-content-between">

                                  <span>Precio final:</span>

                                  <strong className="text-success fs-5">
                                    {formatearPrecio(Number(precioOferta))}
                                  </strong>

                                </div>

                              </div>

                            ) : (

                              <p className="small text-muted">
                                El precio de oferta debe ser inferior al precio normal.
                              </p>

                            )}

                          </>

                        )}

                        {!enOferta && (

                          <div className="alert alert-light small border">
                            Al guardar, el producto quedará sin oferta y recuperará su precio normal.
                          </div>

                        )}

                        <Button
                          type="submit"
                          variant="isaflor"
                          className="w-100 mb-2"
                          disabled={
                            procesando ||
                            (enOferta && !precioOfertaValido)
                          }
                        >

                          {procesando
                            ? 'Guardando...'
                            : 'Guardar Oferta'}

                        </Button>

                        <Button
                          type="button"
                          variant="outline-secondary"
                          className="w-100"
                          onClick={cerrarFormularioOferta}
                          disabled={procesando}
                        >
                          Cancelar
                        </Button>

                      </fieldset>

                    </form>

                  </>

                ) : (

                  <>

                    {/* FORMULARIO DE PRODUCTOS */}

                    <h5 className="card-title admin-card-title mb-3 fw-bold">

                      {editando
                        ? 'Editar Producto'
                        : 'Añadir Nuevo Producto'}

                    </h5>

                    {errorForm && (

                      <div className="alert alert-danger p-2 small mb-3" role="alert">
                        {errorForm}
                      </div>

                    )}

                    <form onSubmit={handleSubmit}>

                      <fieldset disabled={procesando}>

                        <FormInput
                          label="Código del producto"
                          name="codigo"
                          value={form.codigo}
                          onChange={handleChange}
                          placeholder="Ej: ISA-011"
                          required
                        />

                        <FormInput
                          label="Nombre"
                          name="nombre"
                          value={form.nombre}
                          onChange={handleChange}
                          required
                        />

                        <FormInput
                          type="select"
                          label="Categoría"
                          name="idCategoria"
                          value={form.idCategoria}
                          onChange={handleChange}
                          options={[
                            {
                              value: '',
                              label: 'Seleccionar categoría'
                            },
                            ...categorias.map(c => ({
                              value: String(c.id),
                              label: c.nombre
                            }))
                          ]}
                          required
                        />

                        <FormInput
                          label="Precio normal ($)"
                          type="number"
                          name="precioOriginal"
                          value={form.precioOriginal}
                          onChange={handleChange}
                          min="1"
                          step="1"
                          required
                        />

                        <div className="row g-2">

                          <div className="col-6">

                            <FormInput
                              label="Stock"
                              type="number"
                              name="stock"
                              value={form.stock}
                              onChange={handleChange}
                              min="0"
                              step="1"
                              required
                            />

                          </div>

                          <div className="col-6">

                            <FormInput
                              label="Stock crítico"
                              type="number"
                              name="stockCritico"
                              value={form.stockCritico}
                              onChange={handleChange}
                              min="0"
                              step="1"
                              required
                            />

                          </div>

                        </div>

                        <div className="row g-2">

                          <div className="col-6">

                            <FormInput
                              label="Peso normal"
                              type="number"
                              name="peso"
                              value={form.peso}
                              onChange={handleChange}
                              min="0.01"
                              step="0.01"
                              required
                            />

                          </div>

                          <div className="col-6">

                            <FormInput
                              label="Peso volumétrico"
                              type="number"
                              name="pesoVolumetrico"
                              value={form.pesoVolumetrico}
                              onChange={handleChange}
                              min="0.01"
                              step="0.01"
                              required
                            />

                          </div>

                        </div>

                        <FormInput
                          label="Descripción"
                          type="textarea"
                          name="descripcion"
                          value={form.descripcion}
                          onChange={handleChange}
                          required
                        />

                        {editando && productoEditando.enOferta && (

                          <div className="alert alert-info small">

                            Este producto tiene una oferta activa de {' '}

                            <strong>
                              {formatearPrecio(productoEditando.precioOferta)}
                            </strong>.

                            La oferta se conservará al guardar los cambios.

                          </div>

                        )}

                        <Button
                          type="submit"
                          variant="isaflor"
                          className="w-100 mb-2 py-2 fw-semibold"
                          disabled={procesando || categorias.length === 0}
                        >

                          {procesando
                            ? 'Procesando...'
                            : editando
                              ? 'Guardar Cambios'
                              : 'Crear Producto'}

                        </Button>

                        {editando && (

                          <Button
                            type="button"
                            variant="outline-secondary"
                            className="w-100"
                            onClick={resetForm}
                            disabled={procesando}
                          >
                            Cancelar
                          </Button>

                        )}

                      </fieldset>

                    </form>

                  </>

                )}

              </div>

            </div>


            {/* TABLA DE PRODUCTOS */}

            <div className="col-lg-8">

              <div className="card shadow-sm border-0 rounded-4 admin-table-card">

                <div className="card-body p-0">

                  <div className="table-responsive admin-table-responsive">

                    <table className="table table-hover align-middle mb-0">

                      <thead className="table-light">

                        <tr>
                          <th>Producto</th>
                          <th>Categoría</th>
                          <th>Precio</th>
                          <th>Stock</th>
                          <th>Estado</th>
                          <th className="text-end pe-3">Acciones</th>
                        </tr>

                      </thead>

                      <tbody>

                        {productos.length === 0 && (

                          <tr>

                            <td colSpan="6" className="text-center text-muted py-4">
                              No existen productos registrados.
                            </td>

                          </tr>

                        )}

                        {productos.map(p => {

                          const esCritico = tieneStockCritico(p);
                          const agotado = esProductoAgotado(p);

                          return (

                            <tr
                              key={p.id}
                              className={esCritico ? 'table-warning-soft' : ''}
                            >

                              {/* PRODUCTO */}

                              <td>

                                <div className="fw-bold text-dark">
                                  {p.nombre}
                                </div>

                                <small className="text-muted">
                                  {p.codigo}
                                </small>

                              </td>


                              {/* CATEGORÍA */}

                              <td>

                                <span className="badge bg-light text-dark border">
                                  {p.categoria}
                                </span>

                              </td>


                              {/* PRECIO NORMAL Y OFERTA */}

                              <td>

                                {p.enOferta ? (

                                  <>

                                    <div className="small text-muted text-decoration-line-through">
                                      {formatearPrecio(p.precioOriginal)}
                                    </div>

                                    <div className="fw-bold text-success">
                                      {formatearPrecio(p.precioOferta)}
                                    </div>

                                    <Badge bg="isaflor-rose">
                                      -{p.porcentajeDescuento}%
                                    </Badge>

                                  </>

                                ) : (

                                  <span className="fw-semibold">
                                    {formatearPrecio(p.precioOriginal)}
                                  </span>

                                )}

                              </td>


                              {/* STOCK */}

                              <td>

                                <div className="fw-semibold">
                                  {p.stock}
                                </div>

                                <small className="text-muted">
                                  Mín: {p.stockCritico}
                                </small>

                              </td>


                              {/* ESTADO */}

                              <td>

                                <div className="d-flex flex-column align-items-start gap-1">

                                  {agotado ? (

                                    <Badge bg="danger">
                                      Agotado
                                    </Badge>

                                  ) : esCritico ? (

                                    <Badge bg="warning" className="text-dark">
                                      Stock Bajo
                                    </Badge>

                                  ) : (

                                    <Badge bg="success">
                                      Disponible
                                    </Badge>

                                  )}

                                  {p.enOferta && (

                                    <Badge bg="isaflor-rose">
                                      En Oferta
                                    </Badge>

                                  )}

                                </div>

                              </td>


                              {/* ACCIONES */}

                              <td className="text-end pe-3">

                                <div className="d-flex flex-wrap justify-content-end gap-1">

                                  <Button
                                    type="button"
                                    variant="outline-primary"
                                    className="btn-sm"
                                    onClick={() => handleEditar(p)}
                                    disabled={procesando}
                                  >

                                    <i className="bi bi-pencil me-1" aria-hidden="true"></i>

                                    Editar

                                  </Button>

                                  <Button
                                    type="button"
                                    variant="outline-success"
                                    className="btn-sm"
                                    onClick={() => handleGestionarOferta(p)}
                                    disabled={procesando}
                                  >

                                    <i className="bi bi-tag me-1" aria-hidden="true"></i>

                                    Oferta

                                  </Button>

                                  <Button
                                    type="button"
                                    variant="outline-danger"
                                    className="btn-sm"
                                    onClick={() => handleEliminar(p)}
                                    disabled={procesando}
                                  >

                                    <i className="bi bi-trash me-1" aria-hidden="true"></i>

                                    Eliminar

                                  </Button>

                                </div>

                              </td>

                            </tr>

                          );

                        })}

                      </tbody>

                    </table>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </>

      )}

    </div>

  );

};

export default Admin;
