import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Card, Image, Stack, CardBody, CardFooter, Text, Heading } from '@chakra-ui/react';
import './Product.css';
import { CartContext } from '../../context/cart';
import IngredientModal from './IngredientModal';

export default function Product({ selectedKey, searchTerm }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const url = selectedKey
      ? `http://localhost:80/api/productbycategory/${selectedKey}`
      : 'http://localhost:80/api/productbycategory';

    axios
      .get(url)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(
            response.data.map((product) => ({
              ...product,
              precio: parseFloat(product.precio) || 0,
            }))
          );
        } else {
          console.error('La respuesta de la API no es un array:', response.data);
          setProducts([]);
        }
      })
      .catch((error) => {
        console.error('Error al obtener productos: ', error);
      });
  }, [selectedKey]);

  // 🔍 Filtrar productos según el término de búsqueda
  const filteredProducts = products.filter((product) =>
    searchTerm ? product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

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
    <div className="product-container">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <Card key={product.id_producto} direction={{ base: 'column', sm: 'row' }} overflow="hidden" variant="outline" className="product-card">
            <Image objectFit="cover" maxW={{ base: '100%', sm: '200px' }} src={`${product.imagen}`} alt={product.nombre} boxSize="200px" />
            <Stack className="product-info">
              <CardBody className="card-body">
                <Heading size="md">{product.nombre}</Heading>
                <Text py="2">{product.descripcion}</Text>
                <Heading>${product.precio.toFixed(2)}</Heading>
              </CardBody>
              <CardFooter className="card-footer">
                <button className="btn" onClick={() => handleAddToCart(product)}>
                  Agregar al Carrito
                </button>
              </CardFooter>
            </Stack>
          </Card>
        ))
      ) : (
        <Text className="no-products">No se encontraron productos</Text>
      )}

      <IngredientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} productId={selectedProduct?.id} onConfirm={handleModalConfirm} />
    </div>
  );
}

Product.propTypes = {
  selectedKey: PropTypes.string,
  searchTerm: PropTypes.string, // Agregamos validación para searchTerm
};
