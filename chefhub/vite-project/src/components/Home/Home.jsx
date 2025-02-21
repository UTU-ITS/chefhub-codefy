import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import CategoriesDisplay from './CategoriesDisplay';
import CategoryRow from './CategoryRow';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Maneja la búsqueda
  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      navigate(`/menu?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className='home-div'>
      <div className="buscador">
        <p className='slogan'>Pide lo que quieras, Cuando quieras</p>
        <i className='borde buscador-barra'>
          <input 
            className='entrada' 
            type="text" 
            placeholder="Busca productos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <button className='btn' onClick={handleSearch}>Buscar</button>
        </i>
      </div>

      <main className="recomendaciones">
        <section>
          <h1 className='titulos'>Categorias Populares</h1>
          <div className='bloques'>
            <CategoriesDisplay />
          </div>
        </section>

        <CategoryRow />
      </main>
    </div>
  );
}