import React, { useState } from 'react';
import axios from 'axios';
import './RegisterView.css';

const RegisterView = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    preferences: ["Sin preferencias"],
  });

  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [serverCode, setServerCode] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => {
        const preferences = [...prevData.preferences];
        if (checked) {
          preferences.push(value);
        } else {
          const index = preferences.indexOf(value);
          if (index > -1) preferences.splice(index, 1);
        }
        return { ...prevData, preferences };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Nombre es requerido.";
    if (!formData.lastName) newErrors.lastName = "Apellido es requerido.";
    if (!formData.phone) newErrors.phone = "Teléfono es requerido.";
    if (!formData.email) newErrors.email = "Email es requerido.";
    if (!formData.password) newErrors.password = "Contraseña es requerida.";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendVerificationEmail = async () => {
    if (!formData.email) {
      alert("Por favor, ingresa un correo electrónico.");
      return;
    }

    try {
      const response = await fetch("http://localhost/api/sendmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await response.json();

      if (response.ok) {
        setServerCode(result.verificationCode); // Suponiendo que el código se envía de vuelta
        setIsModalOpen(true);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error al enviar el mail:", error);
      alert("Hubo un problema al enviar el mail. Inténtalo más tarde.");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch("http://localhost/api/checktoken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, tokenInput: verificationCode }),
      });

      const result = await response.json();
      console.log(result);
      if (result.success) {

        alert("Código verificado correctamente.");
        setIsModalOpen(false);
        handleRegister();
      } else {
        alert("Código incorrecto, intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error al verificar código:", error);
      alert("Hubo un problema al verificar el código.");
    }
  };

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            pass: formData.password,
            nombre: formData.firstName,
            apellido: formData.lastName,
            telefono: formData.phone,
            role: "cliente",
            preferences: formData.preferences,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Usuario registrado exitosamente");
          window.location.href = "/login";
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error al registrar el usuario:", error);
        alert("Hubo un problema al registrar el usuario.");
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Registro</h2>
      <form className="register-form">
        <div className="form-row">
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
            {errors.firstName && <span className="error">{errors.firstName}</span>}
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
            {errors.lastName && <span className="error">{errors.lastName}</span>}
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>
        </div>
        <button type="button" className="btn-submit" onClick={handleSendVerificationEmail}>
          Enviar Código de Verificación
        </button>
      </form>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Verificar Código</h3>
            <p>Ingrese el código recibido por correo electrónico:</p>
            <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
            <button onClick={handleVerifyCode} className="btn-submit">
              Verificar Código
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterView;
