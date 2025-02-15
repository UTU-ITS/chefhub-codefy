import React, { useContext, useEffect, useState } from "react";
import './ProductDisplay.css';
import axios from 'axios';
import { CartContext } from '../../context/cart';
import IngredientModal from '../Shop/IngredientModal';

export default function ProductDisplay({ categoryId }) {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        if (!categoryId) return;

        const url = `http://chefhub.codefy.com:8080:80/api/productbycategory/${categoryId}`;

        axios.get(url)
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setProducts(response.data.map((product) => ({
                        ...product,
                        precio: parseFloat(product.precio) || 0,
                    })));
                } else {
                    console.error('La respuesta de la API no es un array:', response.data);
                    setProducts([]);
                }
            })
            .catch((error) => {
                console.error('Error al obtener productos: ', error);
            });
    }, [categoryId]);

    const handleAddToCart = (product) => {
        setSelectedProduct({
          id: product.id_producto,
          name: product.nombre,
          price: parseFloat(product.precio) || 0,
          image: product.imagen,
          description: product.descripcion,
        });
        setIsModalOpen(true);
    };

    const handleModalConfirm = (selectedIngredients, extraPrice) => {
        if (selectedProduct) {
          addToCart(
            {
              ...selectedProduct,
              price: (selectedProduct.price || 0) + (extraPrice || 0),
            },
            selectedIngredients
          );
        }
        setSelectedProduct(null);
        setIsModalOpen(false);
      };

    return (
<>
            {products.length > 0 ? (
                products.map((product) => (
                    <div key={product.id_producto} className="productDisplay">
                        <div className="productImage">
                            <img src={product.imagen} alt="Product" />
                        </div>
                        <div className="productInfo">
                            <h3 className="productName">{product.nombre}</h3>
                            <p className="productDescription">{product.descripcion}</p>
                            <p className="productPrice">${product.precio}</p>
                            <button className="product-button" onClick={() => handleAddToCart(product)}>Agregar al carrito</button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No hay productos en esta categoría</p>
            )}

            <IngredientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productId={selectedProduct?.id}
                onConfirm={handleModalConfirm}
            />
</>
    );
}
