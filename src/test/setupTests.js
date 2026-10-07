/*este file se creo para guardar las funciones logicas reutilizables
que no son componentes de interfaz (UI) por ej; validacion del rut, 
correos, telefonos, formato moneda */

// src/test/setupTests.js
import matchers from '@testing-library/jasmine-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

beforeEach(() => {
  jasmine.getEnv().addMatchers(matchers.default.default);
});