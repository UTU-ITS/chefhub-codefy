import React from 'react';
import './AboutUs.css';
import codefy from '../../assets/Codefy.jpg';

export default function AboutUs() { 
  return (
    <>
        <div className='team-header'>

            <h1 className='titulo'>Conoce al Equipo</h1>
            <h2 className='subtitulo'>No solo escribimos código; construimos experiencias, resolvemos problemas</h2>

        </div>

        <p className='team-descripcion'>Somos Codefy, un equipo de tres estudiantes apasionados por la tecnología 
                y el desarrollo de software. 
                Nos une el deseo de aprender, crear y llevar nuestras ideas al siguiente nivel a través del código. 
                Actualmente, estamos trabajando en un proyecto para nuestro estudio, 
                combinando nuestras habilidades para construir soluciones digitales innovadoras y funcionales
        </p>

        <div className='team-container'> 
            <div className='team-member'>
                <img src={codefy} alt='team-member'/>
                <h3 className='nombre'>Marcelo de Souza</h3>
                <p className='rol'>Front End</p>
                <p className='descripcion'>
                    Estudiante de Ingeniería en Informática, apasionado por el desarrollo web y la creación de interfaces de usuario.
                </p>
            </div>
            <div className='team-member'>
                <img src={codefy} alt='team-member'/>
                <h3 className='nombre'>Jesus Villalba</h3>
                <p className='rol'>Back End</p>
                <p className='descripcion'>
                    Estudiante de Ingeniería en Informática, apasionado por la programación y el desarrollo de software.
                </p>
            </div>
            <div className='team-member'>
                <img src={codefy} alt='team-member'/>
                <h3 className='nombre'>Marcos da Costa</h3>
                <p className='rol'>Full Stack</p>
                <p className='descripcion'>
                    Estudiante de Ingeniería en Informática, apasionado por la tecnología y el desarrollo de software.
                </p>
            </div>
        </div>  
    </>
  );
}