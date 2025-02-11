import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Categories from './Categories';
import Product from './Product';
import './Menu.css';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const searchTerm = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || null;

  // Maneja el cambio de categoría y actualiza la URL
  const handleSelectCategory = (categoryId) => {
    setSearchParams({ category: categoryId });
  };

  // Maneja la búsqueda de productos y actualiza la URL
  const handleSearch = (e) => {
    e.preventDefault();
    const term = e.target.elements.search.value;
    setSearchParams({ search: term });
  };

  return (
    <div className="menu-div">
      {/* 🔍 Barra de búsqueda */}
      <div className="search-div">
        <form onSubmit={handleSearch}>
          <i className="borde buscador-barra barra-menu">
            <input type="text" name="search" placeholder="Buscar..." defaultValue={searchTerm} />
            <button type="submit" className="btn">Buscar</button>
          </i>
        </form>
      </div>

      {/* 🏷 Filtros de categorías */}
      <div className="filters-div">
        <div className="filters-tags">
          <button 
            className={`btn-tag ${!selectedCategory ? 'selected' : ''}`} 
            onClick={() => setSearchParams({})} // Limpia filtros
          >
            Todos
          </button>
          <Categories selectedKey={selectedCategory} onSelectKey={handleSelectCategory} />
        </div>
      </div>

      {/* 📦 Catálogo de productos */}
      <div className="catalog">
        <ChakraProvider>
          <Product selectedKey={selectedCategory} searchTerm={searchTerm} />
        </ChakraProvider>
      </div>
    </div>
  );
}
