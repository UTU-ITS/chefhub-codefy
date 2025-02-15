import React, { useEffect, useState } from 'react';
import './CategoryRow.css';
import ProductDisplay from './ProductDisplay';
import axios from 'axios';

export default function CategoryRow() { 
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('http://chefhub.codefy.com:8080:80/api/categories/')
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setCategories(response.data);
                } else {
                    console.error('La respuesta de la API no es un array:', response.data);
                    setCategories([]);
                }
            })
            .catch((error) => {
                console.error('Error al obtener categorías: ', error);
            });
    }, []);

    return (
        <section className='sideScroll'>
            <h1>Sugerencias</h1>
            {categories.length > 0 ? (
                categories.map((category) => (
                    <div key={category.id_categoria}>
                        <h2>{category.nombre}</h2>
                        <div className='bloques'>
                        <ProductDisplay categoryId={category.id_categoria} />
                        </div>
                    </div>
                ))
            ) : (
                <p>No hay categorías disponibles</p>
            )}
        </section>
    );
}
