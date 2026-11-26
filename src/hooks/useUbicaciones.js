
import { useState, useEffect } from 'react';
import { obtenerComunas } from '../services/comunaService';

// Hook personalizado para consultar regiones y comunas
export const useUbicaciones = () => {

  const [comunas, setComunas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Consultar comunas desde el backend
  useEffect(() => {

    let activo = true;

    const cargarComunas = async () => {

      try {
        const datos = await obtenerComunas();

        if (activo) {
          setComunas(datos);
        }

      } catch {
        if (activo) {
          setError('No fue posible cargar las ubicaciones.');
        }

      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarComunas();

    return () => {
      activo = false;
    };

  }, []);

  // Obtener regiones sin duplicados
  const regiones = Array.from(
    new Map(
      comunas
        .filter(comuna => comuna.region)
        .map(comuna => [
          comuna.region.idRegion,
          comuna.region
        ])
    ).values()
  ).sort((a, b) =>
    a.nombreRegion.localeCompare(b.nombreRegion, 'es')
  );

  // Obtener comunas pertenecientes a una región
  const obtenerComunasPorRegion = (idRegion) => {

    return comunas
      .filter(comuna =>
        String(comuna.region?.idRegion) === String(idRegion)
      )
      .sort((a, b) =>
        a.nombreComuna.localeCompare(b.nombreComuna, 'es')
      );
  };

  // Información disponible para otros componentes
  return {
    comunas,
    regiones,
    obtenerComunasPorRegion,
    cargando,
    error
  };
};
