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
    
        if (inputs.password !== inputs.password_1) {
            setError('Las contraseñas no coinciden');
            return;
        }
    
        try {
            const response = await axios.post('http://192.168.0.10:8080/api/resetpassword', {
                pass: inputs.password,
                id_usuario: user.id_usuario,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.data) {
                navigate('/PassChange');
            }
        } catch (err) {
            console.error(err);
        }
    };

    
    return (
            <div className='PassChange-div'>
                <div className="PassChange-div-box">
                    <form onSubmit={handleSubmit}>
                        <div className="PassChange-div-content">
                            <div className="PassChange-span">
                                <strong>Restablezca su contraseña</strong>
                            </div>
                            <span className="PassChange-span">Nueva contraseña</span>
                            <input
                                name="password"
                                type="password"
                                placeholder="Ingrese nueva contraseña"
                                className="txt-area"
                                onChange={handleChange}
                            />
                            <span className="PassChange-span">Repetir nueva contraseña</span>
                            <input
                                name="password_1"
                                type="password"
                                placeholder="Repita nueva contraseña"
                                className="txt-area"
                                onChange={handleChange}
                            />
                            {error && <p className="error-message">{error}</p>}
                            <button className="btn">Cambiar Constraseña</button>
                        </div>
                    </form>
                </div>
            </div>
            
           
    );
}