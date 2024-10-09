import React from 'react'
import Product from './Product'
<<<<<<< HEAD
import NavBar from './NavBar'
=======
import { ChakraProvider } from '@chakra-ui/react'

>>>>>>> 3a4db276cde5b444cf2b22e9cff54c6390f2de46

export default function Menu() {
  return (
    <>
<<<<<<< HEAD
    <NavBar></NavBar>
    <h1>Menu</h1>
=======
    <ChakraProvider>
         <Product></Product>
    </ChakraProvider>
   
>>>>>>> 3a4db276cde5b444cf2b22e9cff54c6390f2de46
    </>
  )
}
