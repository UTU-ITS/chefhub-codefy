import React from 'react'
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import NavBar from './NavBar';
import './LoginView.css';

=======
import Product from './Product';
>>>>>>> 3a4db276cde5b444cf2b22e9cff54c6390f2de46





export default function LoginView() {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState([]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('http://localhost:80/api/controllers/UserController.php', inputs).then(function(response){
            console.log(response.data);
            navigate('/');
        });
        
    }

  return (
    <>
<<<<<<< HEAD
    <div className='login-div'>
      <div className="login-div-box">
=======

   
    <div className="login-div">
>>>>>>> 3a4db276cde5b444cf2b22e9cff54c6390f2de46

        <form onSubmit={handleSubmit}>

          <div className="login-span">
                <strong>Inicio de Sesion</strong>
          </div>

          <div className="login-div-content">
          
          <span className="login-span">Correo Electronico</span>
          <input  name="email" type="email" placeholder="Ingrese Correo Electronico" className="txt-area" onChange={handleChange}></input>

          <span className="login-span">Contraseña</span>
          <input name="pass" type="password" placeholder="Ingrese Contraseña" className="txt-area" onChange={handleChange}></input>
              <a className="forgot-pass"  href="">¿Olvido su contraseña?</a>
          </div>
          <button className="btn" >Iniciar Sesion</button>
          
  
        </form>
      </div>
    </div>

</>

  )
}
