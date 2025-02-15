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

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@.!-_]).{8,}$/;
    return regex.test(password);
  };
  
  const handleSendVerificationEmail = async () => {
    if (!validatePassword(formData.password)) {
      alert("La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial (@.!-_).");
      return;
    }
  
    if (!validateForm()) {
      return; // Si hay errores, detener la ejecución
    }
  
    try {
      const response = await fetch("http://192.168.0.10:8080/api/sendmail", {
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
      const response = await fetch("http://192.168.0.10:8080/api/checktoken", {
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
        const response = await fetch("http://192.168.0.10:8080/api/signup", {
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
      <div className="register-content">
        <div className="register-tittle">
          <h1>¡Bienvenido!</h1>
          <p>Regístrate para disfrutar
            de todos nuestros productos.</p>
        </div>
              <div className="register-form">
                  <div className="register-group">
                    <label>Nombre</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                    {errors.firstName && <span className="error">{errors.firstName}</span>}
                  </div>
                  <div className="register-group">
                    <label>Apellido</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                    {errors.lastName && <span className="error">{errors.lastName}</span>}
                  </div>
                  <div className="register-group">
                    <label>Teléfono</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
                    {errors.phone && <span className="error">{errors.phone}</span>}
                  </div>
                  <div className="register-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
                    {errors.email && <span className="error">{errors.email}</span>}
                  </div>
                  <div className="register-group">
                    <label>Contraseña</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
                    {errors.password && <span className="error">{errors.password}</span>}
                  </div>
                  <div className="register-group">
                    <label>Confirmar Contraseña</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
                    {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                  </div>
                  <div className="register-group">
                    <button type="button" className="btn" onClick={handleSendVerificationEmail}>
                    Enviar Código de Verificación
                  </button>
                  </div>
                {isModalOpen && (
              <div className="modal">
                <div className="modal-content-register">
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

            
          </div>
    </div>
  );
};

export default RegisterView;
