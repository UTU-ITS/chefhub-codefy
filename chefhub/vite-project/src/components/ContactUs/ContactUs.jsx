import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import "./ContactUs.css";

const Contactanos = () => {
  const toast = useToast();

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  // Validar email con regex
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Manejar cambios en los campos
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar formulario
  const SendContactUs = async (e) => {
    e.preventDefault();

    // Validación de campos vacíos
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      toast({
        title: "Error",
        description: "Debes completar todos los campos",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validación de email
    if (!validateEmail(formData.email)) {
      toast({
        title: "Error",
        description: "Correo electrónico no válido",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost/api/contactus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Mensaje enviado",
          description: "Te responderemos a la brevedad",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setFormData({
          nombre: "",
          email: "",
          mensaje: "",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo enviar el correo",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el mensaje",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (

    <div className="contact-container">
      <h2>Contáctanos</h2>
      <form className="contact-form" onSubmit={SendContactUs}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          className="input-field"
        />
        <textarea
          name="mensaje"
          placeholder="Tu mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          required
          className="textarea-field"
        />
        <button type="submit" className="submit-button">
          Enviar
        </button>
      </form>

   
    </div>
    
  );
};

export default Contactanos;
