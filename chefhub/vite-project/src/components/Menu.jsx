import React from 'react'
import Product from './Product'
import Categories from './Categories'
import { ChakraProvider } from '@chakra-ui/react'
import './Menu.css'



export default function Menu() {
  return (
    <>

    <div className='menu-div'>
      
      <div className='filters'>
        <h1 className='filters-title'>Filtros</h1>
        <Categories></Categories>
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
