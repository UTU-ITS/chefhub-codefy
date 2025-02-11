import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import { format } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import './Reservations.css';
import { UserIcon, RightArrow, LeftArrow ,ReservationsIcon} from '../../img/HeroIcons';
import { UserContext } from '../../context/user';
import { es } from 'date-fns/locale';

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
    setStep(1);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setSelectedTable(null);
    setShowContactForm(false);
    setStep(2);
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setShowContactForm(false);
    setStep(3);
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
        <div className="reservas-header">
          <h1>Realiza tu lugar ahora</h1>
          <ReservationsIcon />
        </div>
      <div className="reservas-description">
        <p>Selecciona la fecha, hora y mesa para tu reserva. Asegúrate de completar todos los pasos y proporcionar tus datos de contacto para confirmar</p>  
      </div>
        <div className="reservas-content">
          {step === 1 && (
            <div className="reservas-section">
              <div className="reservas-section-left">
                <div className="slots-section">
                  <Calendar
                  onChange={handleDateChange}
                  value={date}
                  minDate={new Date()}
                  className="custom-calendar"
                  locale="es"
                  formatMonthYear={(locale, date) =>
                    format(date, "MMMM yyyy", { locale: es }).charAt(0).toUpperCase() +
                    format(date, "MMMM yyyy", { locale: es }).slice(1)
                  }
                />
                </div>
              </div>
              <div className="reservas-section-right">
                {date ? (
                  <div className="reservation-summary">
                    <div className="item-summary">
                      <h2>Fecha seleccionada</h2>
                      <p className="selected-date">{format(date, 'dd MMMM yyyy', { locale: es })}</p>
                    </div>
                  </div>
                ) : (
                  <div className="reservation-instructions">
                    <p>Por favor, selecciona una fecha para continuar.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && date && (
            <div className="reservas-section">
              <div className="reservas-section-left">
                <div className="slots-section">
                  <div className="slots-title">
                    <h2>Horarios Disponibles</h2>
                  </div>
                  <div className="slots-grid">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        className={`card-slot ${selectedTime === time ? 'selected' : ''}`}
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="reservas-section-right">
                <div className="reservation-summary">
                  <div className="item-summary">
                      <h2>Fecha seleccionada</h2>
                      <p className="selected-date">{format(date, 'dd MMMM yyyy', { locale: es })}</p>
                  </div>
                </div>
                {selectedTime ? (
                  <div className="reservation-summary">
                    <div className="item-summary">
                      <h2>Hora seleccionada</h2>
                      <p className="selected-date">{selectedTime} hs</p>
                    </div>
                  </div>
                ) : (
                  <div className="reservation-instructions">
                    <p>Por favor, selecciona una hora para continuar.</p>
                  </div>
                )}
              </div>
            </div>
          )}


          {step === 3 && date && selectedTime && tables.length > 0 && (
            <div className="reservas-section">
              <div className="reservas-section-left">
                <div className="slots-section">
                  <div className="slots-title">
                    <h2>Mesas Disponibles</h2>
                  </div>
                  <div className="slots-grid">
                    {tables.map((table) => (
                      <div
                        key={table.id_mesa}
                        className={`card-slot ${selectedTable?.id_mesa === table.id_mesa ? 'selected' : ''}`}
                        onClick={() => handleTableSelect(table)}
                      >
                        <h3>Mesa {table.id_mesa}</h3>
                        <p><span className='table-capacity'>{table.capacidad}</span> personas</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="reservas-section-right">
                <div className="reservation-summary">
                  <div className="item-summary">
                      <h2>Fecha seleccionada</h2>
                      <p className="selected-date">{format(date, 'dd MMMM yyyy', { locale: es })}</p>
                    </div>
                    <div className="item-summary">
                      <h2>Hora seleccionada</h2>
                      <p className="selected-date">{selectedTime} hs</p>
                  </div>
                  {selectedTable && (
                    <>
                      <div className="item-summary">
                        <h2>Mesa seleccionada</h2>
                        <p className='selected-date'>N° {selectedTable.id_mesa}</p>
                      </div>
                      <div className="item-summary">
                        <h2>Capacidad</h2>
                        <p className='selected-date'>{selectedTable.capacidad} personas</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 4 && date && selectedTime && selectedTable && (
            <div className="reservas-section">
              <div className="reservas-section-left">
                <div className="reservation-summary">
                    <div className="item-summary">
                        <h2>Fecha seleccionada</h2>
                        <p className="selected-date">{format(date, 'dd MMMM yyyy', { locale: es })}</p>
                      </div>
                      <div className="item-summary">
                        <h2>Hora seleccionada</h2>
                        <p className="selected-date">{selectedTime} hs</p>
                    </div>
                        <div className="item-summary">
                          <h2>Mesa seleccionada</h2>
                          <p className='selected-date'>N° {selectedTable.id_mesa}</p>
                        </div>
                        <div className="item-summary">
                          <h2>Capacidad</h2>
                          <p className='selected-date'>{selectedTable.capacidad} personas</p>
                        </div>
                  </div>
              </div>
              <div className="reservas-section-right">
                  <div className="slots-section">
                  <div className="slots-title">
                    <h2>Información de Contacto</h2>
                  </div>
                  <div className="contact-form">
                    <div className="form-item">
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
                    <div className="form-item">
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
                </div>
              </div>
            </div>
          )}

        </div>
        <div className="reservas-navigation">
          {step > 1 && (
            <button className="btn" onClick={() => setStep(step - 1)}>
              <LeftArrow />
            </button>
          )}
          {step < 4 && (
            <>
              {user && user.data ? (
                <div className="reservation-next-button">
                  <button
                    className="btn"
                    onClick={() => setStep(step + 1)}
                    disabled={
                      (["Chef", "Mesero", "Administrativo"].includes(user.data.cargo)) || 
                      (step === 1 && !date) || 
                      (step === 2 && !selectedTime) || 
                      (step === 3 && !selectedTable)
                    }
                  >
                    <RightArrow />
                  </button>
                </div>
              ) : (
                <div className="login-prompt">
                  <p>Por favor, inicia sesión para continuar con la reserva.</p>
                  <a href="/login">
                    <button className="login-button">
                      <UserIcon />
                      Iniciar Sesión
                    </button>
                  </a>
                </div>
              )}
            </>
          )}
          {step === 4 && selectedTable && (
            <button className="btn" onClick={handleReservation}>
              Confirmar Reserva
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reservations;
