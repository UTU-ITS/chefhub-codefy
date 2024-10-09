import React from 'react'
import './Home.css'



export default function Home() {
  return (
    <div className='home-div'>
      <div className="home-div-box">
        <div className="home-div-content">
          <h1 className="home-h1">Bienvenido a Chef Hub</h1>
          <p className="home-p">La mejor plataforma para encontrar recetas de cocina</p>
          <a href="/menu" className="btn">Ver Menu</a>
        </div>
      </div>
    </div>
  )
}
