import React, { useState } from 'react';
import axios from 'axios';
import './RegisterView.css';

const RegisterView = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        contrasena: '',
        preferencia: '',
    });
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState(1);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSendCode = async () => {
        try {
            await axios.post('/api/send-verification-code', { telefono: formData.telefono });
            setStep(2);
        } catch (error) {
            alert('Error al enviar el código de verificación.');
        }
    };

    const handleVerifyCode = async () => {
        try {
            const response = await axios.post('/api/verify-code', { 
                telefono: formData.telefono,
                code: verificationCode
            });
            if (response.data.success) {
                setIsVerified(true);
                alert('Verificación exitosa.');
                setIsModalOpen(false);
            } else {
                alert('Código de verificación incorrecto.');
            }
        } catch (error) {
            alert('Error al verificar el código.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isVerified) {
            alert('Por favor verifica tu teléfono antes de registrarte.');
            return;
        }
        try {
            const response = await axios.post('/api/register', formData);
            if (response.data.success) {
                alert('Usuario registrado con éxito.');
            } else {
                alert('Error en el registro.');
            }
        } catch (error) {
            alert('Error al registrar el usuario.');
        }
    };

    return (
        <div className="register-div">
            <div className="register-div-box">
                <h2>Registro</h2>
                <form onSubmit={handleSubmit} className="register-div-content">
                    <input
                        type="text"
                        name="nombre"
                        className="txt-area"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="apellido"
                        placeholder="Apellido"
                        className="txt-area"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="telefono"
                        placeholder="Teléfono"
                        className="txt-area"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="contrasena"
                        placeholder="Contraseña"
                        className="txt-area"
                        value={formData.contrasena}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="preferencia"
                        value={formData.preferencia}
                        onChange={handleChange}
                        className="select-area"
                    >
                        <option value="">-- Preferencias Alimentarias --</option>
                        <option value="vegetariana">Vegetariana</option>
                        <option value="vegana">Vegana</option>
                        <option value="sin_gluten">Sin Gluten</option>
                        <option value="kosher">Kosher</option>
                    </select>
                    {!isVerified && (
                        <button className="btn-register" type="button" onClick={() => setIsModalOpen(true)}>
                            Verificar Teléfono
                        </button>
                    )}
                    <button className="btn-register" type="submit">Registrarse</button>
                </form>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Verificación de Teléfono</h3>
                            <button className="btn-close" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            {step === 1 ? (
                                <>
                                    <p>Introduce tu número de teléfono para recibir un código de verificación.</p>
                                    <button className="btn-register" onClick={handleSendCode}>
                                        Enviar Código
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p>Introduce el código recibido:</p>
                                    <input
                                        className="txt-area"
                                        type="text"
                                        placeholder="Código de Verificación"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                    />
                                    <button className="btn-register" onClick={handleVerifyCode}>
                                        Verificar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegisterView;