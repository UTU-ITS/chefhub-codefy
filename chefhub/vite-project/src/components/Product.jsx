import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Card,Image,Stack,CardBody,CardFooter,Text,ChakraProvider} from '@chakra-ui/react';
import Categories from './Categories';
import './Product.css';

export default function Product({ selectedKey, onSelectKey }) { // Recibe onSelectKey para manejar la selección de categoría
  const [products, setProducts] = useState([]);

  // Fetch products from API
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
    <ChakraProvider>
      <div className="product-div">
        {products.length > 0 ? (
          products.map((product) => (
            <Card key={product.id_producto} maxW="sm" className="productCard">
              <CardBody>
                <Image
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
              <Categories onSelectKey={onSelectKey} id={product.id_categoria} />
              <CardFooter className='card-footer'>
                <button className='btn'>Comprar</button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Text>No hay productos disponibles</Text>
        )}
      </div>
    </ChakraProvider>
  );
}
