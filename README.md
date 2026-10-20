# IsaFlor

IsaFlor es un proyecto que estamos desarrollando para practicar la creación de una tienda en línea para una florería. La idea es que las personas puedan conocer los productos, agregarlos a un carrito y simular una compra.

Es un proyecto de aprendizaje, por lo que todavía hay partes que funcionan como demostración y no como una tienda conectada a servicios reales.

## ¿Qué se puede hacer?

- Ver la página de inicio, el catálogo, las ofertas, la información de la florería y el contacto.
- Buscar productos y filtrarlos por categoría.
- Agregar productos al carrito y cambiar las cantidades.
- Completar un formulario de compra y generar una boleta de demostración.
- Crear una cuenta e iniciar sesión como cliente.
- Ingresar al panel de administración para revisar órdenes y gestionar productos.

## Tecnologías que usamos

- React para crear las pantallas y componentes.
- Vite para ejecutar el proyecto durante el desarrollo y generar la versión de producción.
- React Router para navegar entre las páginas.
- Bootstrap y CSS para los estilos.
- Karma, Jasmine y webpack para ejecutar las pruebas.

## Requisitos

- Node.js 22.18 o superior de la versión 22, o Node.js 24.11 o superior.
- npm, que se instala junto con Node.js.
- Google Chrome instalado para ejecutar las pruebas automatizadas.

## Cómo ejecutar el proyecto

1. Clona el repositorio y entra a la carpeta del proyecto:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd isaFlor
   ```

   Reemplaza `<URL_DEL_REPOSITORIO>` con la dirección del repositorio.

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abre en el navegador la dirección que indique Vite en la terminal (normalmente `http://localhost:5173`).

## Comandos disponibles

| Comando | Para qué sirve |
| --- | --- |
| `npm run dev` | Inicia el proyecto en modo de desarrollo. |
| `npm run build` | Genera los archivos para producción en la carpeta `dist`. |
| `npm run preview` | Muestra localmente la versión generada en `dist`. |
| `npm run lint` | Revisa el código con ESLint. |
| `npm test` | Ejecuta las pruebas una vez en Chrome Headless. |
| `npm run test:watch` | Inicia Karma en modo de observación. |

## Datos y limitaciones

Por ahora, la aplicación no utiliza un servidor ni una base de datos. Algunos datos, como las cuentas, las órdenes y los productos modificados, se guardan en el `localStorage` del navegador. Por eso, los datos son locales a cada navegador y no se comparten entre usuarios o dispositivos.

El proceso de compra y la selección de medio de pago son demostrativos: no se realiza un cobro real. El acceso de administración también es parte de esta demostración y no debe considerarse un sistema de autenticación seguro para producción.

La aplicación muestra estas credenciales de demostración en la pantalla de inicio de sesión:

- Correo: `admin@isaflor.cl`
- Contraseña: `admin123`

## Organización del proyecto

```text
src/
├── components/   # Componentes reutilizables de la interfaz
├── data/         # Productos y funciones para manejar datos locales
├── pages/        # Páginas de la tienda y administración
├── styles/       # Estilos CSS
├── test/         # Pruebas automatizadas
└── utils/        # Validaciones y funciones auxiliares
```

## Sobre el proyecto

Estamos usando este proyecto para aprender y practicar React, la organización de componentes, el manejo de formularios, las rutas y las pruebas. Seguiremos mejorándolo a medida que avancemos.
