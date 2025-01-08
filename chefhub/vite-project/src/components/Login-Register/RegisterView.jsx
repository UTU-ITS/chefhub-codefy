import React, { useState } from 'react';
import axios from 'axios';
import './RegisterView.css';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select } from '@chakra-ui/react';

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
        <div className="login-div">
            <div className="login-div-box">
                <h2>Registro</h2>
                <form onSubmit={handleSubmit} className="login-div-content">
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
                    >
                        <option value="">-- Preferencias Alimentarias --</option>
                        <option value="vegetariana">Vegetariana</option>
                        <option value="vegana">Vegana</option>
                        <option value="sin_gluten">Sin Gluten</option>
                        <option value="kosher">Kosher</option>
                    </select>
                    {!isVerified && (
                        <Button className="btn" type="button" onClick={() => setIsModalOpen(true)}>
                            Verificar Teléfono
                        </Button>
                    )}
                    <Button className="btn" type="submit">Registrarse</Button>
                </form>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  
     <ModalContent className="modal-content"
     >
        <ModalHeader className="modal-header">Verificación de Teléfono</ModalHeader>
        <ModalBody className="modal-body">
            {step === 1 ? (
                <>
                    <p>Introduce tu número de teléfono para recibir un código de verificación.</p>
                    <Button className="btn" onClick={handleSendCode}>
                        Enviar Código
                    </Button>
                </>
            ) : (
                <>
                    <p>Introduce el código recibido:</p>
                    <Input
                        className="txt-area"
                        type="text"
                        placeholder="Código de Verificación"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                </>
            )}
        </ModalBody>
        <ModalFooter className="modal-footer">
            {step === 2 && (
                <Button className="btn" onClick={handleVerifyCode}>
                    Verificar
                </Button>
            )}
            <Button className="btn btn-close" onClick={() => setIsModalOpen(false)}>
                Cerrar
            </Button>
        </ModalFooter>
    </ModalContent>
</Modal>
        </div>
    );
};

export default RegisterView;
