<<<<<<< HEAD
import React from 'react'
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
=======
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
>>>>>>> 3a4db276cde5b444cf2b22e9cff54c6390f2de46

export default function Product() {
  return (
       
    <Card
<<<<<<< HEAD
=======
      className="productCard"
>>>>>>> 3a4db276cde5b444cf2b22e9cff54c6390f2de46
      direction={{ base: 'column', sm: 'row' }}
      overflow='hidden'
      variant='outline'
    >
<<<<<<< HEAD
    <Image
      objectFit='cover'
      maxW={{ base: '100%', sm: '200px' }}
      src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
      alt='Caffe Latte'
    />

    <Stack>
      <CardBody>
        <Heading size='md'>The perfect latte</Heading>
        <Text py='2'>
        Caffè latte is a coffee beverage of Italian origin made with espresso
        and steamed milk.
        </Text>
      </CardBody>

      <CardFooter>
        <Button variant='solid' colorScheme='blue'>
          Buy Latte
        </Button>
      </CardFooter>
    </Stack>
  </Card>
  )
=======
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
>>>>>>> 3a4db276cde5b444cf2b22e9cff54c6390f2de46
}
