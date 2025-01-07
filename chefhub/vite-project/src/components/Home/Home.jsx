import React from 'react'
import './Home.css'
import { ChakraProvider } from '@chakra-ui/react';
import { PinIcon } from '../../img/HeroIcons';

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

      <main className="recomendaciones borde">
        <section className="section-categorias borde">
          <h1 className='titulos'>Categorias Populares</h1>
          <div className='bloques'>
            <div className="bloque  borde">
            </div>
            <div className="bloque  borde">
            </div>
            <div className="bloque  borde">
            </div>
            <div className="bloque  borde">
            </div>
            <div className="bloque  borde">
            </div>
          </div>
        </section>

        <section className="sugerencias  borde">
          <h1>Sugerencias</h1>
          <div className='bloques'>
            <div className="bloque  borde">
            </div>
            <div className="bloque  borde">
            </div>
            <div className="bloque  borde">
            </div>
            <div className="bloque  borde">
            </div>
            <div className="bloque  borde">
            </div>
          </div>
        </section>

        <section className="opciones  borde">
          <h1>Opciones</h1>
          <div className='bloques'>
            <div className="bloque  borde">
            </div>
            <div className="bloque  borde">
            </div>
            <div className="bloque  borde">
            </div>
            <div className="bloque  borde">
            </div>
            <div className="bloque  borde">
            </div>
          </div>
        </section>
      </main>

      <section className="registrate  borde">
        <h3>Registra tu Empresa</h3>
      </section>
      <footer className="borde">

      </footer>
    </div>

    </ChakraProvider>
  )
}
