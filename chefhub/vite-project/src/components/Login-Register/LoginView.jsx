import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginView.css';
import { ChakraProvider } from '@chakra-ui/react';
import { UserContext } from '../../context/user';

export default function LoginView() {
    const navigate = useNavigate();
    const { login } = useContext(UserContext); // Acceder al contexto para guardar el usuario
    const [inputs, setInputs] = useState({});
    const [error, setError] = useState(''); // Estado para manejar errores

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Limpiar errores previos

        try {
            const response = await axios.post(
                'http://localhost/api/login',
                {
                    email: inputs.email,
                    password: inputs.password,
                },
                {
            headers: {
                'Content-Type': 'application/json', // Asegura que el servidor pueda interpretar JSON
            },
        });

            if (response.data) {
                login(response.data);
                console.log(response.data) // Guardar los datos del usuario en el contexto
                navigate('/'); // Redirigir al inicio u otra ruta
            }
        } catch (err) {
            console.error(err);
            setError('Error de inicio de sesión. Verifique sus credenciales.'); // Mostrar error en caso de fallo
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
                            <a className="forgot-pass" href="">¿Olvidó su contraseña?</a>
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
        </ChakraProvider>
    );
}
