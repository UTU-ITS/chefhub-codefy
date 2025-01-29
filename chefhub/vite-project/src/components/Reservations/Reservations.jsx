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

  // Obtener horarios disponibles
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
            console.error('No se encontraron horarios disponibles');
          }
        } catch (error) {
          console.error('Error fetching time slots:', error);
          setTimeSlots([]);
          alert('No se pudieron obtener los horarios disponibles. Intenta nuevamente más tarde.');
        }
      };

      fetchTimeSlots();
    }
  }, [date]);

  // Obtener mesas disponibles cuando se selecciona fecha y hora
  useEffect(() => {
    if (date && selectedTime) {
      const fetchTables = async () => {
        try {
          const formattedDate = format(date, 'yyyy-MM-dd');
          const response = await axios.post(
            'http://localhost/api/freetables', 
            { date: formattedDate, time: selectedTime },
            { headers: { 'Content-Type': 'application/json' } }
          );

          if (Array.isArray(response.data)) {
            setTables(response.data);
          } else {
            setTables([]);
            console.error('No se encontraron mesas disponibles');
          }
        } catch (error) {
          console.error('Error fetching tables:', error);
          setTables([]);
          alert('No se pudieron obtener las mesas disponibles. Intenta nuevamente más tarde.');
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
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setSelectedTable(null);
    setShowContactForm(false);
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setShowContactForm(false);
  };

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 Ahora la reserva solo se ejecuta cuando el usuario presiona el botón
  const handleReservation = async () => {
    if (!selectedTime || !selectedTable) {
      alert('Por favor selecciona una hora y una mesa');
      return;
    }

    if (!showContactForm) {
      setShowContactForm(true);
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
    } catch (error) {
      console.error('Error making reservation:', error);
      alert('Error al realizar la reserva');
    }
  };

  return (
    <div className="reservas-container">
      <h1>Reservas</h1>
      
      <div className="reservas-content">
        <div className="calendar-section">
          <Calendar
            onChange={handleDateChange}
            value={date}
            minDate={new Date()}
            className="custom-calendar"
          />
        </div>

        {date && (
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
          </div>
        )}

        {date && selectedTime && tables.length > 0 && (
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
          </div>
        )}
      </div>

      {showContactForm && (
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
        </div>
      )}

      {user && user.data ? (
        date && selectedTime && selectedTable ? (
          <button className="reserve-button" onClick={handleReservation}>
            {showContactForm ? 'Confirmar Datos' : 'Confirmar Reserva'}
          </button>
        ) : (
          <p>Por favor selecciona una fecha, un horario y una mesa para continuar</p>
        )
      ) : (
        <>
          <p>Por favor inicia sesión para continuar</p>
          <a href="/login"> <button> <UserIcon /> </button></a>
        </>
      )}
    </div>
  );
}

export default Reservations;
