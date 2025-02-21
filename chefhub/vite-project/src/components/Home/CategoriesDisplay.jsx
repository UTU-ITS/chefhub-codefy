import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoriesDisplay.css";
import axios from "axios";

export default function Recomendacion() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://192.168.0.10:8080/api/categories/")
      .then((response) => {
        if (Array.isArray(response.data)) {
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

  const handleCategoryClick = (category) => {
    navigate(`/menu?category=${category.id_categoria}`); // Pasamos solo el ID por URL
  };

  return (
    <>
      {categories.length > 0 ? (
        categories.map((category) => (
          <div 
            key={category.id_categoria} 
            className="blur-container"
            onClick={() => handleCategoryClick(category)}
            style={{ 
              backgroundImage: category.imagen ? `url("http://192.168.0.10:8080/${category.imagen}")` : `url("default-image.png")`,
              cursor: "pointer"
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
