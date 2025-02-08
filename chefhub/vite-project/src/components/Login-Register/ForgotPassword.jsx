import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import { ChakraProvider } from '@chakra-ui/react';
import Modal from 'react-modal';
import { UserContext } from '../../context/user';

Modal.setAppElement('#root');

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [inputs, setInputs] = useState({});
    const [error, setError] = useState('');
    console.log(user);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost/api/resetpassword', {
                pass: inputs.password,
                id_usuario: user.id_usuario,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.data) {
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
        }
    };

    
    return (
            <div className='login-div'>
                <div className="login-div-box">
                    <form onSubmit={handleSubmit}>
                        <div className="login-span">
                            <strong>Restablezca su contraseña</strong>
                        </div>
                        <div className="login-div-content">
                            <span className="login-span">Nueva contraseña</span>
                            <input
                                name="password"
                                type="password"
                                placeholder="Ingrese nueva contraseña"
                                className="txt-area"
                                onChange={handleChange}
                            />
                            <span className="login-span">Repetir nueva contraseña</span>
                            <input
                                name="password_1"
                                type="password_1"
                                placeholder="Repita nueva contraseña"
                                className="txt-area"
                                onChange={handleChange}
                            />

                        </div>
                        <div className="btns-login">
                            <button className="btn">Cambiar Constraseña</button>
                        </div>
                    </form>
                </div>
            </div>
            
           
    );
}
