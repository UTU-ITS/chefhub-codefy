import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginView.css';
import { ChakraProvider } from '@chakra-ui/react';
import { UserContext } from '../../context/user';

export default function LoginView() {
    const navigate = useNavigate();
    const { login } = useContext(UserContext);
    const [inputs, setInputs] = useState({});
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // Estado para controlar la vista (1 = Email, 2 = Password)

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleContinue = () => {
        if (inputs.email) {
            setStep(2); // Pasar a la pantalla de contraseña
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
        <ChakraProvider>
            <div className='login-div'>
                <div className='login-div-text'>
                    <h1>Ingresa tu e-mail para</h1>
                    <h1>iniciar sesión</h1>
                </div>
                <div className="login-div-box">
                    <form onSubmit={handleSubmit} className="login-form">
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
                                        <button type="button" className="btn btn-register">Registrarse</button>
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
                                        <button className="btn">Iniciar Sesión</button>
                                        <button className='btn btn-otc'>¿Olvidaste tu contraseña?</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </ChakraProvider>
    );
}
