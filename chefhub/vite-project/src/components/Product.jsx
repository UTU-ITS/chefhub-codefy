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
  ButtonGroup,
  Divider,
  ChakraProvider,
} from '@chakra-ui/react';
import './Product.css';

export default function Product() {
  const [products, setProducts] = useState([]);

  // Función para obtener productos de la API
  useEffect(() => {
    axios
      .get('http://localhost:80/api/controllers/ProductController.php')
      .then((response) => {
        // Verificar que la respuesta sea un array
        if (Array.isArray(response.data)) {
          setProducts(response.data); // Asume que tu API devuelve un array de productos
        } else {
          console.error('La respuesta de la API no es un array:', response.data);
          setProducts([]); // Asignar un array vacío si no es un array
        }
      })
      .catch((error) => {
        console.error('Hubo un error al obtener los productos: ', error);
      });
  }, []);

  return (
    <ChakraProvider>
      <div className="product-div">
        {products.length > 0 ? (
          products.map((product) => (
            <Card key={product.id} maxW="sm" className="productCard">
              <CardBody>
                <Image
                  src={product.imagen} // URL de la imagen desde la API
                  alt={product.nombre}
                  borderRadius="lg"
                />
                <Stack mt="6" spacing="3">
                  <p className='title'>{product.nombre}</p>
                  <p className='description'>{product.descripcion}</p>
                  <p className='price'>
                    ${product.precio}
                  </p>
                </Stack>
              </CardBody>
             <span>
              <button className='btn-tags'>Example</button>
             </span>

              <CardFooter className='card-footer'>
             
                  <button className='btn'>
                   Comprar
                  </button>
              
              </CardFooter>
            </Card>
          ))
        ) : (
          <Text>Cargando productos...</Text> // Mensaje de carga mientras se obtienen los productos
        )}
      </div>
    </ChakraProvider>
  );
}