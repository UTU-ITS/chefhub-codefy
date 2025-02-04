import React from 'react'
import './Home.css'
import { ChakraProvider } from '@chakra-ui/react';
import { PinIcon } from '../../img/HeroIcons';
import Categorias from './CategoriesDisplay';
import ProductDisplay from './ProductDisplay';

export default function Home() {
  return (
    <ChakraProvider>

    <div className='home-div'>
      <div className="buscador">
        <p className='slogan'>Pide lo que quieras, Cuando quieras</p>
        <i className='borde buscador-barra'>
          <PinIcon />
          <input className='entrada' type="text" placeholder="Busca locales" />
          <button className='btn'>Buscar</button>
        </i>
      </div>

      <main className="recomendaciones">
        <section className="section-categorias">
          <h1 className='titulos'>Categorias Populares</h1>
          <div className='bloques'>
     
              <Categorias />
              <Categorias />
              <Categorias />

          </div>
        </section>

        <section className="sugerencias">
          <h1>Sugerencias</h1>
          <div className='bloques'>
            
            <ProductDisplay />

          </div>
        </section>

        <section className="opciones">
          <h1>Opciones</h1>
          <div className='bloques'>
            <div className="blur-container">
            </div>
            <div className="blur-container">
            </div>
            <div className="blur-container">
            </div>
            <div className="blur-container">
            </div>
            <div className="blur-container">
            </div>
          </div>
        </section>
      </main>

      <section className="registrate">
        <h3>Registra tu Empresa</h3>
      </section>
      <footer className="borde">

      </footer>
    </div>

    </ChakraProvider>
  )
}
