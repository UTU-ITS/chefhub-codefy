import React from "react";
import "./ContactUs.css";

const Contactanos = () => {
  return (
    <div className="contact-container">
      <h2>Contáctanos</h2>
      <form className="contact-form">
        <input type="text" placeholder="Nombre" required className="input-field" />
        <input type="email" placeholder="Correo electrónico" required className="input-field" />
        <textarea placeholder="Tu mensaje" required className="textarea-field"></textarea>
        <button type="submit" className="submit-button">Enviar</button>
      </form>
    </div>
  );
};

export default Contactanos;