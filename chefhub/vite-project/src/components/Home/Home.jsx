import React from 'react'
import './Home.css'

import CategoriesDisplay from './CategoriesDisplay';
import CategoryRow from './CategoryRow';

export default function Home() {
  return (

    <div className='home-div'>
      <div className="buscador">
        <p className='slogan'>Pide lo que quieras, Cuando quieras</p>
        <i className='borde buscador-barra'>
          <input className='entrada' type="text" placeholder="Busca productos..." />
          <button className='btn'>Buscar</button>
        </i>
      </div>

      <main className="recomendaciones">
        <section >
          <h1 className='titulos'>Categorias Populares</h1>
          <div className='bloques'>
     
              <CategoriesDisplay />

          </div>
        </section>
        
          <CategoryRow />

      </main>

      <section className="registrate">
        <h3>Registra tu Empresa</h3>
      </section>
      <footer className="borde">

      </footer>
    </div>
  )
}
