import React from 'react'
import Product from './Product'
import NavBar from './NavBar'
import { ChakraProvider } from '@chakra-ui/react'
import './Menu.css'



export default function Menu() {
  return (
    <>
    <div className='menu-div'>
      <div className='filters'>
        <h1>Filters</h1>
      </div>
      <div className="catalog">
        <ChakraProvider>
            <Product></Product>
        </ChakraProvider>
    </div>
    </div>



    </>
  )
}
