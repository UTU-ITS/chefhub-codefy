import React from 'react'
import './Checkout.css'
import { CartContext } from '../../context/cart'
import { useContext } from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import NavBar from '../Home/NavBar'; // Importa NavBar correctamente



export default function Checkout() {


  
  return (
   <>
   <NavBar/>

   <ChakraProvider>
  <div className='checkout'>
        <Tabs isFitted variant='enclosed' className='tabs'>
       <TabList className='tab-list' mb='1em'>
         <Tab className='btn-tab'>Envio a domicilio</Tab>
         <Tab className='btn-tab'>Entrega a la mesa</Tab>
       </TabList>
       <TabPanels>
         <TabPanel>
           <p>one!</p>
         </TabPanel>
         <TabPanel>
           <p>two!</p>
         </TabPanel>
       </TabPanels>

      </Tabs>
</div>
   </ChakraProvider>
   </>
    
  )
}
