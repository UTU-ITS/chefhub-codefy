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
            style={{ cursor: "pointer" }}
          >
            <img 
              src={category.imagen ? `http://192.168.0.10:8080/uploads/${category.imagen}` : `default-image.png`} 
              alt={category.nombre} 
              className="category-image"
            />
            <div className="blur-text">{category.nombre}</div>
          </div>
        ))
      ) : (
        <p>No hay categorías disponibles</p>
      )}
    </>
  );
}
