import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Categories.css';

export default function Categories({ id = null, selectedKey, onSelectKey }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const url = id
      ? `http://localhost:80/api/categories/${id}`
      : 'http://localhost:80/api/categories/';

    axios
      .get(url)
      .then((response) => {
        if (response.data) {
          const data = Array.isArray(response.data) ? response.data : [response.data];
          setCategories(data);
        } else {
          console.error('La respuesta de la API no es válida:', response.data);
          setCategories([]);
        }
      })
      .catch((error) => {
        console.error('Hubo un error al obtener las categorías: ', error);
      });
  }, [id]);

  return (
    <span>
      {categories.length > 0 ? (
        categories.map((category) => (
          <button
            key={category.id_categoria}

            className={`btn-tag ${selectedKey === category.id_categoria ? 'selected' : ''}`}
            onClick={() => onSelectKey(category.id_categoria)} 
          >
            {category.nombre}
          </button>
        ))
      ) : (
        <p>No hay categorías</p>
      )}
    </span>
  );
}
