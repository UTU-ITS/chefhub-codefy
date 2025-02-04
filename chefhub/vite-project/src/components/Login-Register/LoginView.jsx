import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginView.css';
import { ChakraProvider } from '@chakra-ui/react';
import Modal from 'react-modal';
import { UserContext } from '../../context/user';

Modal.setAppElement('#root');

export default function LoginView() {
    const navigate = useNavigate();
    const { login } = useContext(UserContext);
    const [inputs, setInputs] = useState({});
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [step, setStep] = useState(1);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost/api/login', {
                email: inputs.email,
                password: inputs.password,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.data) {
                login(response.data);
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            setError('Error de inicio de sesión. Verifique sus credenciales.');
        }
    };

    const handleSendVerificationEmail = async () => {
        const HandleCheckMailisRegistered = async () => {
            try {
                const response = await axios.post("http://localhost/api/checkemail", { email });
                if (response.data.success) {
                    console.log(response.data);
                    return response.data; // Devuelvo la id si el correo está registrado
                } else {
                    alert(`Error: ${response.data.message}`);
                    return null; // Si no está registrado, devuelvo null
                }
            } catch (error) {
                console.error("Error al verificar el correo:", error);
                alert("Este correo no está registrado.");
                return null;
            }
        }
    
        if (!email) {
            alert("Por favor, ingresa un correo electrónico.");
            return;
        }
    
        // Verificamos si el correo está registrado
        const userId = await HandleCheckMailisRegistered();
        if (!userId) return; // Si la verificación falla, no continuamos
    
        // Ahora enviamos el correo solo si la verificación es exitosa
        try {
            const response = await axios.post("http://localhost/api/sendmail", { email });
            if (response.data.success) {
                setStep(2);
    
                // Aquí guardamos la id en el contexto del usuario
                // Asegúrate de tener acceso a tu contexto y setearlo adecuadamente
                login({ id_usuario: userId.data }); // O la forma adecuada de actualizar el contexto
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error al enviar el mail:", error);
            alert("Hubo un problema al enviar el mail. Inténtalo más tarde.");
        }
    };
    
    

    const handleVerifyCode = async () => {
        try {
            const response = await axios.post("http://localhost/api/checktoken", { email, tokenInput: verificationCode });
            
            if (response.data.success) {
               
                alert("Código verificado correctamente.");
                setModalIsOpen(false);
                navigate('/forgot-password');
            } else {
                alert("Código incorrecto, intenta de nuevo.");
            }
        } catch (error) {
            console.error("Error al verificar código:", error);
            alert("Hubo un problema al verificar el código.");
        }
    };

    return (
        <ChakraProvider>
            <div className='login-div'>
                <div className="login-div-box">
                    <form onSubmit={handleSubmit}>
                        <div className="login-span">
                            <strong>Inicio de Sesión</strong>
                        </div>
                        <div className="login-div-content">
                            <span className="login-span">Correo Electrónico</span>
                            <input
                                name="email"
                                type="email"
                                placeholder="Ingrese Correo Electrónico"
                                className="txt-area"
                                onChange={handleChange}
                            />
                            <span className="login-span">Contraseña</span>
                            <input
                                name="password"
                                type="password"
                                placeholder="Ingrese Contraseña"
                                className="txt-area"
                                onChange={handleChange}
                            />
                            {error && <div className="error-message">{error}</div>}
                            <button type="button" className="forgot-pass" onClick={() => setModalIsOpen(true)}>¿Olvidó su contraseña?</button>
                        </div>
                        <div className="btns-login">
                            <button className="btn">Iniciar Sesión</button>
                            <a href="/register">
                                <button type="button" className="btn">Registrarme</button>
                            </a>
                        </div>
                    </form>
                </div>
            </div>
            
            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="modal-content">
                {step === 1 && (
                    <div>
                        <h2>Recuperar contraseña</h2>
                        <input type="email" placeholder="Ingrese su correo" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <button onClick={handleSendVerificationEmail}>Enviar</button>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h2>Ingrese el código de verificación</h2>
                        <input type="text" placeholder="Código" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                        <button onClick={handleVerifyCode}>Verificar</button>
                    </div>
                )}
            </Modal>
        </ChakraProvider>
    );
}
