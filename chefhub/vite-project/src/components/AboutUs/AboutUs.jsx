import React from 'react';
import './AboutUs.css';
import codefy from '../../assets/Codefy.jpg';

export default function AboutUs() {
  const teamMembers = [
    {
      name: 'Marcelo de Souza',
      role: 'Front End',
      description: 'Estudiante de Ingeniería en Informática, apasionado por el desarrollo web y la creación de interfaces de usuario.',
      image: codefy,
      social: {
        linkedin: '#',
        github: '#',
      },
    },
    {
      name: 'Jesus Villalba',
      role: 'Back End',
      description: 'Estudiante de Ingeniería en Informática, apasionado por la programación y el desarrollo de software.',
      image: codefy,
      social: {
        linkedin: '#',
        github: '#',
      },
    },
    {
      name: 'Marcos da Costa',
      role: 'Full Stack',
      description: 'Estudiante de Ingeniería en Informática, apasionado por la tecnología y el desarrollo de software.',
      image: codefy,
      social: {
        linkedin: '#',
        github: '#',
      },
    },
  ];

  return (
    <>
      <div className='team-header'>
        <h1 className='titulo'>Conoce al Equipo</h1>
        <h2 className='subtitulo'>No solo escribimos código; construimos experiencias, resolvemos problemas</h2>
      </div>

      <p className='team-descripcion'>
        Somos Codefy, un equipo de tres estudiantes apasionados por la tecnología y el desarrollo de software.
        Nos une el deseo de aprender, crear y llevar nuestras ideas al siguiente nivel a través del código.
        Actualmente, estamos trabajando en un proyecto para nuestro estudio, combinando nuestras habilidades
        para construir soluciones digitales innovadoras y funcionales.
      </p>

      <div className='team-container'>
        {teamMembers.map((member, index) => (
          <div className='team-member' key={index}>
            <img src={member.image} alt={member.name} />
            <h3 className='nombre'>{member.name}</h3>
            <p className='rol'>
              {member.icon} {member.role}
            </p>
            <p className='descripcion'>{member.description}</p>
            <div className='social-links'>
              <a href={member.social.linkedin} target='_blank' rel='noopener noreferrer'>
                LinkedIn
              </a>
              <a href={member.social.github} target='_blank' rel='noopener noreferrer'>
                GitHub
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}