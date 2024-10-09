import React from 'react'
import Product from './Product'
import NavBar from './NavBar'
import { ChakraProvider } from '@chakra-ui/react'



export default function Menu() {
  return (
    <>

    <ChakraProvider>
         <Product></Product>
    </ChakraProvider>
   

    </>
  )
}
