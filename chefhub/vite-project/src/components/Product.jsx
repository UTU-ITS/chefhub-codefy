import React, { useEffect, useState } from 'react';
import axios from 'axios'; 

import {
  Card,
  Image,
  Stack,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  ChakraProvider
} from '@chakra-ui/react'; 
import './Product.css';

export default function Product() {
  const [products, setProducts] = useState([]);

  // Función para obtener productos de la API
  useEffect(() => {
    axios.get('http://localhost:80/api/controllers/ProductController.php')
      .then(response => {
        // Verificar que la respuesta sea un array
        if (Array.isArray(response.data)) {
          setProducts(response.data); // Asume que tu API devuelve un array de productos
        } else {
          console.error('La respuesta de la API no es un array:', response.data);
          setProducts([]); // Asignar un array vacío si no es un array
        }
      })
      .catch(error => {
        console.error("Hubo un error al obtener los productos: ", error);
      });
  }, []);

  return (
    <div className='product-div'>
      {products.length > 0 ? (
        products.map((product) => (
          <Card
            className="productCard"
            key={product.id}
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
          >
            <Image
              objectFit='cover'
              maxW={{ base: '100%', sm: '200px' }}
              src={product.imagen} // URL de la imagen desde la API
              alt={product.nombre}
            />

            <Stack>
              <CardBody>
                <Heading className="title" size='md'>{product.nombre}</Heading>
                <Text py='2'>
                  {product.descripcion}
                </Text>
                <Text py='2' fontWeight='bold'>
                  ${product.precio}
                </Text>
              </CardBody>

              <CardFooter>
                <Button className="btn" variant='solid'>
                  Comprar {product.nombre}
                </Button>
              </CardFooter>
            </Stack>
          </Card>
        ))
      ) : (
        <Text>Cargando productos...</Text> // Mensaje de carga mientras se obtienen los productos
      )}
    </div>
  );
}
