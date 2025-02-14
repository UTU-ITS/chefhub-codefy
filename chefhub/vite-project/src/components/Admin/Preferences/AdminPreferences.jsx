import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminPreferences.css';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminPreferences() {
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Traemos las preferencias desde la API
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('http://localhost:80/api/getpreferences');
        const result = await response.json();

        if (result.data && result.data.length > 0) {
          setPreferences(result.data);
        } else {
          console.error('Error al cargar las preferencias: Datos no encontrados');
        }
      } catch (error) {
        console.error('Error al cargar las preferencias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  // Manejo del guardado de preferencias
  const handleSavePreferences = async () => {
    try {
      // Enviar los datos al servidor usando Axios
      const response = await axios.put('http://localhost/api/updatepreferences', { preferences });
    console.log(response);
      if (response.data.success) {
        alert('Preferencias guardadas con éxito');
      } else {
        toast.error('Error al guardar las preferencias');
      }
    } catch (error) {
      console.error('Error al guardar las preferencias:', error);
      toast.error('Hubo un problema al guardar las preferencias');
    }
  };

  // Mostrar mensaje de carga
  if (loading) {
    return <div>Cargando Horarios...</div>;
  }

  // Función para manejar los cambios en los inputs
  const handleChange = (e, index, field) => {
    const updatedPreferences = [...preferences];
    updatedPreferences[index][field] = e.target.value;
    setPreferences(updatedPreferences);
  };

  return (
    <div className="admin-preferences">
      <h2 className="text-xl font-semibold text-purple-700 mb-4">Configuracion de Horarios</h2>
      <form className="preferences-form">
        {preferences.length > 0 ? (
          preferences.map((pref, index) => (
            <div key={index} className="preference-item p-4 bg-gray-100 rounded-lg mb-4">
              <h3 className="font-semibold">{pref.dia_semana}</h3>
              <div className="flex gap-4">
                <div>
                  <label>Hora de apertura</label>
                  <input
                    type="time"
                    value={pref.horario_apertura}
                    className="p-2 border border-gray-300 rounded"
                    onChange={(e) => handleChange(e, index, 'horario_apertura')}
                  />
                </div>
                <div>
                  <label>Hora de cierre</label>
                  <input
                    type="time"
                    value={pref.horario_cierre}
                    className="p-2 border border-gray-300 rounded"
                    onChange={(e) => handleChange(e, index, 'horario_cierre')}
                  />
                </div>
                <div>
                  <label>Duración de reserva</label>
                  <input
                    type="time"
                    value={pref.duracion_reserva}
                    className="p-2 border border-gray-300 rounded"
                    onChange={(e) => handleChange(e, index, 'duracion_reserva')}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No se encontraron preferencias.</p>
        )}
      </form>
      
      <button onClick={handleSavePreferences} className="save-button">
        Guardar Preferencias
      </button>
    </div>
  );
}
