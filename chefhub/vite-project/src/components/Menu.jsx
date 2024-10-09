import React from 'react'
import Product from './Product'
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
