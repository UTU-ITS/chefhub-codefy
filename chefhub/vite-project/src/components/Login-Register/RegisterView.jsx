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
  // const [isModalOpen, setIsModalOpen] = useState(false); // Comentado por ahora
  // const [verificationCode, setVerificationCode] = useState(""); // Comentado por ahora

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
            role: "cliente", // Cambia si es necesario
            preferences: formData.preferences,
          }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert("Usuario registrado exitosamente");
          console.log("Respuesta del servidor:", result);
          // Redirigir al usuario a la página de inicio de sesión
          window.location.href = "/login"; // Ajusta la ruta según tu proyecto
        } else {
          alert(`Error: ${result.message}`);
          console.error("Error del servidor:", result);
        }
      } catch (error) {
        console.error("Error al consumir la API:", error);
        alert("Hubo un problema al registrar el usuario. Inténtalo más tarde.");
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-row">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            {errors.firstName && <span className="error">{errors.firstName}</span>}
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            {errors.lastName && <span className="error">{errors.lastName}</span>}
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>
        </div>
        <div className="form-group">
          <label>Preferencias Alimentarias</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                value="Sin preferencias"
                checked={formData.preferences.includes("Sin preferencias")}
                onChange={handleInputChange}
              />
              Sin preferencias
            </label>
            <label>
              <input
                type="checkbox"
                value="Vegetariano"
                onChange={handleInputChange}
              />
              Vegetariano
            </label>
            <label>
              <input
                type="checkbox"
                value="Vegano"
                onChange={handleInputChange}
              />
              Vegano
            </label>
            <label>
              <input
                type="checkbox"
                value="Omnívoro"
                onChange={handleInputChange}
              />
              Omnívoro
            </label>
          </div>
        </div>
        <button type="submit" className="btn-submit">
          Registrarme
        </button>
        
      </form>

      {/*modal */}
      {/* 
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Verificar Código</h3>
            <p>Ingrese el código que recibió por SMS:</p>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button onClick={handleVerificationSubmit} className="btn-submit">
              Verificar
            </button>
          </div>
        </div>
      )}
      */}
    </div>
  );
};

export default RegisterView;