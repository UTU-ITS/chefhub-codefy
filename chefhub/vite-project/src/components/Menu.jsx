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
    setSelectedCategory(null); // Al hacer clic en "Todos", se selecciona null para mostrar todos los productos
  };

  return (
    <>
      <div className='menu-div'>
        <div className='filters'>
          <h1 className='filters-title'>Filtros</h1>
          {/* Clase condicional: cambia el color si se selecciona "Todos" */}
          <button 
            className={`btn-tag ${selectedCategory === null ? 'selected' : ''}`} 
            onClick={handleSelectAll}
          >
            Todos
          </button>
          {/* Pasar setSelectedCategory como callback para actualizar la categoría */}
          <Categories selectedKey={selectedCategory} onSelectKey={setSelectedCategory} />
        </div>

        <div className="catalog">
          <ChakraProvider>
            {/* Pasar la categoría seleccionada como prop */}
            <Product selectedKey={selectedCategory} onSelectKey={setSelectedCategory} />
          </ChakraProvider>
        </div>
      </div>
    </>
  );
}
