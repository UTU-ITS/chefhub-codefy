import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Categories from './Categories';
import Product from './Product';
import './Menu.css';
import Cart from './Cart';

export default function Menu() {
  // Estado para la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Función para manejar cuando se selecciona "Todos"
  const handleSelectAll = () => {
    setSelectedCategory(null); // Al hacer clic en "Todos", se selecciona null para mostrar todos los productos
  };

  return (
    <>
      <div className='menu-div'>
        <div className='filters'>
          <Cart/>
          <h1 className='filters-title'>Filtros</h1>
         
          <button 
            className={`btn-tag ${selectedCategory === null ? 'selected' : ''}`} 
            onClick={handleSelectAll}
          >
            Todos
          </button>
          <Categories selectedKey={selectedCategory} onSelectKey={setSelectedCategory} />
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
