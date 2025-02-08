import React, { useEffect, useState } from "react";
import "./CategoriesDisplay.css";
import axios from "axios";

export default function Recomendacion() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:80/api/categories/")
      .then((response) => {
        if (Array.isArray(response.data)) {
          console.log("Categorías recibidas:", response.data); // <-- Agregado para depuración
          setCategories(response.data);
        } else {
          console.error("La respuesta de la API no es un array:", response.data);
          setCategories([]);
        }
      })
      .catch((error) => {
        console.error("Error al obtener categorías: ", error);
      });
  }, []);

  return (
    <>
      {categories.length > 0 ? (
        categories.map((category) => (
          <div 
            key={category.id_categoria} 
            className="blur-container"
            style={{ 
              backgroundImage: category.imagen ? `url("${category.imagen}")` : `url("default-image.jpg")` 
            }}
          >
            <div className="blur-text">{category.nombre}</div>
          </div>
        ))
      ) : (
        <p>No hay categorías disponibles</p>
      )}
    </>
  );
}