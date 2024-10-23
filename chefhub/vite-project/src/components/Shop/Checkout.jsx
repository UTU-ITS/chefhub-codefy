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
    <div className='cart'></div>
        <Tabs isFitted variant='enclosed' className='tabs'>
       <TabList className='tab-list' mb='1em'>
         <Tab className='btn-tab'>Envio a domicilio</Tab>
         <Tab className='btn-tab'>Entrega a la mesa</Tab>
       </TabList>
       <TabPanels>
         <TabPanel>
          <div className='delivery'>
          <div className='directions'>
            <h2>Dirección de envio</h2>
            <input type='text' placeholder='Calle' className='txt-area'/>
            <input type='text' placeholder='Número' className='txt-area'/>
            <input type='text' placeholder='Apto(Opcional)' className='txt-area'/>
            <p className='details'>Detalles de envio.</p>
            <input type="text" placeholder='Por ej. Puerta negra' className='txt-area-notes' /> </div>
         
        </div>
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
