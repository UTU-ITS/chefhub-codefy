// src/components/Product.jsx
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Card, Image, Stack, CardBody, CardFooter, Text } from '@chakra-ui/react';
import Categories from './Categories';
import './Product.css';
import { CartContext } from '../../context/cart';
import IngredientModal from './IngredientModal';

export default function Product({ selectedKey, onSelectKey }) {
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
          setProducts(response.data);
        } else {
          console.error('La respuesta de la API no es un array:', response.data);
          setProducts([]);
        }
      })
      .catch((error) => {
        console.error('Hubo un error al obtener los productos: ', error);
      });
  }, [selectedKey]);

  const handleAddToCart = (product) => {
    setSelectedProduct({
      id: product.id_producto,
      name: product.nombre,
      price: product.precio,
      image: product.imagen,
      description: product.descripcion,
    });
    setIsModalOpen(true);
  };

  const handleModalConfirm = (selectedIngredients, extraPrice) => {
    if (selectedProduct) {
      addToCart({
        ...selectedProduct,
        price: selectedProduct.price + extraPrice
      }, selectedIngredients);
    }
    setSelectedProduct(null);
  };

  return (
    <div className="product-div">
      {products.length > 0 ? (
        products.map((product) => (
          <Card key={product.id_producto} maxW="sm" className="productCard">
            <CardBody>
              <Image
                className='product-image'
                src={product.imagen}
                alt={product.nombre}
                borderRadius="lg"
              />
              <Stack mt="6" spacing="3">
                <p className='title'>{product.nombre}</p>
                <p className='description'>{product.descripcion}</p>
                <p className='price'>${product.precio}</p>
              </Stack>
            </CardBody>
            <Categories id={product.id_categoria} onSelectKey={onSelectKey} />
            <CardFooter className='card-footer'>
              <button className='btn' onClick={() => handleAddToCart(product)}>
                Agregar al Carrito
              </button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Text>No hay productos disponibles</Text>
      )}

      <IngredientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={selectedProduct?.id}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}

Product.propTypes = {
  selectedKey: PropTypes.string,
  onSelectKey: PropTypes.func.isRequired,
};
