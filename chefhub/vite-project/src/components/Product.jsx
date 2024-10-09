
import React from 'react';
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
} from '@chakra-ui/react'; // Make sure Chakra UI is installed
import './Product.css';


export default function Product() {
  return (
       
    <Card
      className="productCard"
      direction={{ base: 'column', sm: 'row' }}
      overflow='hidden'
      variant='outline'
    >
      <Image
        objectFit='cover'
        maxW={{ base: '100%', sm: '200px' }}
        src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
        alt='Caffe Latte'
      />

      <Stack>
        <CardBody>
          <Heading className="title" size='md'>Nombre</Heading>

          <Text py='2'>
            Caffè latte is a coffee beverage of Italian origin made with
            espresso and steamed milk.
          </Text>
        </CardBody>

        <CardFooter>
          <Button className="btn" variant='solid'>
            Buy Latte
          </Button>
        </CardFooter>
      </Stack>
    </Card>
  );
}
