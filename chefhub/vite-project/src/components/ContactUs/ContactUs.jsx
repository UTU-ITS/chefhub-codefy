import React from "react";
import "./ContactUs.css";

const Contactanos = () => {
  return (
    <div className="contact">
        <div className="contact-container">
        <h2 className="contact-title">Contáctanos</h2>
        <p className="contact-subtitle">Estamos aquí para ayudarte. ¡Escríbenos!</p>
        <form className="contact-form">
          <div className="form-group">
            <input type="text" placeholder="Nombre" required className="input-field" />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Correo electrónico" required className="input-field" />
          </div>
          <div className="form-group">
            <textarea placeholder="Tu mensaje" required className="textarea-field"></textarea>
          </div>
          <button type="submit" className="submit-button">Enviar Mensaje</button>
        </form>
      </div>
    </div>
    
  );
};

export default Contactanos;