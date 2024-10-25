import React from 'react'
import './Home.css'
import { ChakraProvider } from '@chakra-ui/react';



export default function Home() {
  return (
    <ChakraProvider>

    <div className='home-div'>
      <div className="home-div-box">
        <div className="home-div-content">
          <h1 className="home-h1">Bienvenido a Chef Hub</h1>
          <p className="home-p">La mejor plataforma para encontrar recetas de cocina</p>
          <a href="/menu" className="btn">Ver Menu</a>
          <a href="/admin" className="btn">admin</a>
        </div>
      </div>
    </div>

    </ChakraProvider>
  )
}
