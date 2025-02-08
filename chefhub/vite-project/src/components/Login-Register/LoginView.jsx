import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginView.css';
import Modal from 'react-modal';
import { UserContext } from '../../context/user';

Modal.setAppElement('#root');

export default function LoginView() {
    const navigate = useNavigate();
    const { user, login } = useContext(UserContext);
    const [inputs, setInputs] = useState({});
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [stepFG, setStepFG] = useState(1);
    const [step, setStep] = useState(1);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleContinue = () => {
        if (inputs.email) {
            setStep(2);
        } else {
            setError('Por favor, ingrese su correo electrónico.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await axios.post(
                'http://localhost/api/login',
                {
                    email: inputs.email,
                    password: inputs.password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.data) {
                login(response.data);

                navigate('/');
            }
        } catch (err) {
            console.error(err);
            setError('Error de inicio de sesión. Verifique sus credenciales.');
        }
        
    };

    return (
        <div className='login-div'>
            <div className='login-div-text'>
                <h1>Ingresa tu e-mail para</h1>
                <h1>iniciar sesión</h1>
            </div>
            <div className="login-div-box">
                <div className="login-div-content">
                    {step === 1 && (
                        <>
                            <div className="login-div-email">
                                <span className="login-span">E-mail</span>
                            </div>
                            <div className='login-div-email'>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Ingrese su correo"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="login-div-email">
                                {error && <div className="error-message">{error}</div>}
                            </div>
                            <div className="login-div-email div-button-register">
                                <button type="button" className="btn" onClick={handleContinue}>Continuar</button>
                                <a href="/register">
                                    <button type="button" className="btn btn-register">Registrarse</button>
                                </a>
                            </div>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <div className="login-div-email">
                                <span className="login-span">Contraseña</span>
                            </div>
                            <div className="login-div-email">
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Ingrese su contraseña"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="login-div-email">
                                {error && <div className="error-message">{error}</div>}
                            </div>
                            <div className="login-div-email">
                                <button className="btn" onClick={handleSubmit}>Iniciar Sesión</button>
                                <button className='btn btn-otc' onClick={() => setModalIsOpen(true)}>¿Olvidaste tu contraseña?</button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="modal-content-login">
                {stepFG === 1 && (
                    <div>
                        <h2>Recuperar contraseña</h2>
                        <input type="email" placeholder="Ingrese su correo" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <button>Enviar</button>
                    </div>
                )}
                {stepFG === 2 && (
                    <div>
                        <h2>Ingrese el código de verificación</h2>
                        <input type="text" placeholder="Código" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                        <button>Verificar</button>
                    </div>
                )}
            </Modal>
        </div>
    );
}
