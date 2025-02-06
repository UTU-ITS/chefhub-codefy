import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import { format } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import './Reservations.css';
import { UserIcon } from '../../img/HeroIcons';
import { UserContext } from '../../context/user';

function Reservations() {
  const { user } = useContext(UserContext);
  const [date, setDate] = useState(null);
  const [tables, setTables] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: '', phone: '' });
  const [step, setStep] = useState(1); // Variable para controlar los pasos

  useEffect(() => {
    if (date) {
      const fetchTimeSlots = async () => {
        try {
          const formattedDate = format(date, 'yyyy-MM-dd');
          const response = await axios.get(`http://localhost/api/freehours/${formattedDate}`);
          if (Array.isArray(response.data)) {
            setTimeSlots(response.data.map(item => item.hora));
          } else {
            setTimeSlots([]);
          }
        } catch (error) {
          setTimeSlots([]);
          alert('Error al obtener los horarios disponibles. Intenta más tarde.');
        }
      };
      fetchTimeSlots();
    }
  }, [date]);

  useEffect(() => {
    if (date && selectedTime) {
      const fetchTables = async () => {
        try {
          const formattedDate = format(date, 'yyyy-MM-dd');
          const response = await axios.post('http://localhost/api/freetables', 
            { date: formattedDate, time: selectedTime }, 
            { headers: { 'Content-Type': 'application/json' } }
          );
          if (Array.isArray(response.data)) {
            setTables(response.data);
          } else {
            setTables([]);
          }
        } catch (error) {
          setTables([]);
          alert('Error al obtener las mesas disponibles. Intenta más tarde.');
        }
      };
      fetchTables();
    }
  }, [date, selectedTime]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setSelectedTime(null);
    setSelectedTable(null);
    setShowContactForm(false);
    setStep(1); // Volver al primer paso cuando se cambie la fecha
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setSelectedTable(null);
    setShowContactForm(false);
    setStep(2); // Ir al siguiente paso
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setShowContactForm(false);
    setStep(3); // Ir al siguiente paso
  };

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleReservation = async () => {
    if (!selectedTime || !selectedTable) {
      alert('Por favor selecciona una hora y una mesa');
      return;
    }

    if (!contactInfo.name || !contactInfo.phone) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      await axios.post('http://localhost/api/insertreservations', {
        fecha: formattedDate,
        hora: selectedTime,
        id_mesa: selectedTable.id_mesa,
        nombre_reserva: contactInfo.name,
        tel_contacto: contactInfo.phone,
        cant_personas: selectedTable.capacidad,
        id_cliente: user.data.id_usuario
      });
      alert('Reserva realizada con éxito');
      setDate(null);
      setSelectedTime(null);
      setSelectedTable(null);
      setShowContactForm(false);
      setContactInfo({ name: '', phone: '' });
      setTables([]);
      setTimeSlots([]);
      setStep(1); // Volver al primer paso
    } catch (error) {
      alert('Error al realizar la reserva');
    }
  };

  return (
    <div className="reservas">
      <div className="reservas-container">
        <h1>Reservas</h1>
        <div className="reservas-content">
          {step === 1 && (
            <div className="calendar-section">
              <Calendar
                onChange={handleDateChange}
                value={date}
                minDate={new Date()}
                className="custom-calendar"
              />
              {date && (
                <div className="summary">
                  <h3>Fecha seleccionada: {format(date, 'dd MMMM yyyy')}</h3>
                </div>
              )}
              {user && user.data ? (
                <button className="next-step-button" onClick={() => setStep(2)}>
                  Siguiente
                </button>
              ) : (
                <>
                  <p>Por favor inicia sesión para continuar</p>
                  <a href="/login">
                    <button><UserIcon /></button>
                  </a>
                </>
              )}
            </div>
          )}

          {step === 2 && date && (
            <div className="time-slots-section">
              <h2>Horarios Disponibles</h2>
              <div className="time-slots-grid">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
              {selectedTime && (
                <div className="summary">
                  <h3>Hora seleccionada: {selectedTime}</h3>
                </div>
              )}
              {user && user.data ? (
                <button className="next-step-button" onClick={() => setStep(3)}>
                  Siguiente
                </button>
              ) : (
                <>
                  <p>Por favor inicia sesión para continuar</p>
                  <a href="/login">
                    <button><UserIcon /></button>
                  </a>
                </>
              )}
            </div>
          )}

          {step === 3 && date && selectedTime && tables.length > 0 && (
            <div className="tables-section">
              <h2>Mesas Disponibles</h2>
              <div className="tables-grid">
                {tables.map((table) => (
                  <div
                    key={table.id_mesa}
                    className={`table-card ${selectedTable?.id_mesa === table.id_mesa ? 'selected' : ''}`}
                    onClick={() => handleTableSelect(table)}
                  >
                    <h3>Mesa {table.id_mesa}</h3>
                    <p>Capacidad: {table.capacidad} personas</p>
                  </div>
                ))}
              </div>
              {selectedTable && (
                <div className="summary">
                  <h3>Mesa seleccionada: {selectedTable.id_mesa} (Capacidad: {selectedTable.capacidad} personas)</h3>
                </div>
              )}
              {user && user.data ? (
                <button className="next-step-button" onClick={() => setStep(4)}>
                  Siguiente
                </button>
              ) : (
                <>
                  <p>Por favor inicia sesión para continuar</p>
                  <a href="/login">
                    <button><UserIcon /></button>
                  </a>
                </>
              )}
            </div>
          )}

          {step === 4 && date && selectedTime && selectedTable && (
            <div className="contact-form">
              <h2>Información de Contacto</h2>
              <div className="form-group">
                <label htmlFor="name">Nombre:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={contactInfo.name}
                  onChange={handleContactInfoChange}
                  placeholder="Ingrese su nombre"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Teléfono:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={contactInfo.phone}
                  onChange={handleContactInfoChange}
                  placeholder="Ingrese su teléfono"
                />
              </div>
              <button className="reserve-button" onClick={handleReservation}>
                Confirmar Reserva
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Reservations;
