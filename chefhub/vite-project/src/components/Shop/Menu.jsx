import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Categories from './Categories';
import Product from './Product';
import './Menu.css';

export default function Menu() {
  // Estado para la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Función para manejar cuando se selecciona "Todos"
  const handleSelectAll = () => {
    setSelectedCategory(null);
  };

  return (
    <>
   
      <div className='menu-div'>
        <div className='search-div'>
          <i className='borde buscador-barra barra-menu'>
          <input type='text' placeholder='Buscar...' />
          <button className='btn'>Buscar</button>
          </i>
        </div>
        <div className='filters-div'>
          <div className='filters-tags'>
            <button className={`btn-tag ${selectedCategory === null ? 'selected' : ''}`} onClick={handleSelectAll}>
              Todos
            </button>
            <Categories selectedKey={selectedCategory} onSelectKey={setSelectedCategory} className={'btn-tag'}/>
          </div>
        </div>

        <div className="catalog">
          <ChakraProvider>
            <Product selectedKey={selectedCategory} onSelectKey={setSelectedCategory} />
          </ChakraProvider>
        </div>
      </div>
    </>
  );
}
