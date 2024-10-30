import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Image, Stack, CardBody, CardFooter, Text, ChakraProvider } from '@chakra-ui/react';
import Categories from './Categories';
import './Product.css';
import { CartContext, CartProvider } from '../../context/cart';

export default function Product({ selectedKey, onSelectKey }) {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const url = selectedKey
      ? `http://localhost:80/api/products/${selectedKey}`
      : 'http://localhost:80/api/products';

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

  return (
    <CartProvider>
      <ChakraProvider>
        <div className="product-div">
          {products.length > 0 ? (
            products.map((product) => {
              const handleAddToCart = () => {
                const productData = {
                  id: product.id_producto,
                  name: product.nombre,
                  price: product.precio,
                  image: product.imagen,
                  description: product.descripcion,
                  quantity: 1
                };
                addToCart(productData, 1);
              };

              return (
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
                  <Categories id={product.id_categoria} onSelectKey={onSelectKey}></Categories>
                  <CardFooter className='card-footer'>
                    <button className='btn' onClick={handleAddToCart}>
                      Agregar al Carrito
                    </button>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <Text>No hay productos disponibles</Text>
          )}
        </div>
      </ChakraProvider>
    </CartProvider>
  );
}