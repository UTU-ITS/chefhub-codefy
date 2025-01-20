import React, { useState, useContext } from 'react';
import './Checkout.css';
import { ChakraProvider, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import NavBar from '../Home/NavBar';
import { CartContext } from '../../context/cart';
import CartSummary from './CartSummary';

export default function Checkout() {
  
  const [selectedPayment, setSelectedPayment] = useState('');

  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.value);
  };

  return (
    <>
      <NavBar />

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
                    <input type='text' placeholder='Calle' className='txt-area' />
                    <input type='text' placeholder='Número' className='txt-area' />
                    <input type='text' placeholder='Apto(Opcional)' className='txt-area' />
                    <p className='details'>Detalles de envio.</p>
                    <input type="text" placeholder='Por ej. Puerta negra' className='txt-area-notes' />
                  </div>
                  <div className='payment_methods'>
                  <h2>Metodo de Pago</h2>          
                    <label>
                      <input type='radio' className='radio' name='payment' value='efectivo' onChange={handlePaymentChange} /> Efectivo
                    </label>
                    <label>
                      <input type='radio' className='radio' name='payment' value='tarjeta' onChange={handlePaymentChange} /> Tarjeta
                    </label>
                  </div>
                  {selectedPayment === 'efectivo' && (
                    <div className='payment_details'>
                      <h2>Pago en Efectivo</h2>
                      <p>Necesita cambio?</p>
                      <label>
                        <input type='radio' className='radio' name='change' value='si' /> Si
                      </label>
                      <label>
                        <input type='radio' className='radio' name='change' value='no' /> No
                      </label>
                      <input type='text' placeholder='Monto con el que pagará' className='txt-area' />
                    </div>
                  )}
                  {selectedPayment === 'tarjeta' && (
                    <div className='payment_details'>
                      <h3>Pago con Tarjeta</h3>
                      <input type='text' placeholder='Número de Tarjeta' className='txt-area' />
                      <input type='text' placeholder='Nombre en la Tarjeta' className='txt-area' />
                      <input type='date' placeholder='Fecha de Expiración' className='txt-area' />
                      <input type='text' placeholder='CVV' className='txt-area' />
                    </div>
                  )}
            </div>
              </TabPanel>
              <TabPanel>
                <p>Número de mesa</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
        <CartSummary isCheckout={true}></CartSummary>
      </ChakraProvider>
    </>
  );
}