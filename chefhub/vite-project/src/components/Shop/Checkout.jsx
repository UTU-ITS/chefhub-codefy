import React, { useState, useContext, useEffect } from 'react';
import './Checkout.css';
import { ChakraProvider, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { PlusCircle, MapPin, CreditCard, Banknote } from 'lucide-react';
import NavBar from '../Home/NavBar';
import { CartContext } from '../../context/cart';
import { UserContext } from '../../context/user';
import CartSummary from './CartSummary';
import axios from 'axios';

export default function Checkout() {
  const { user } = useContext(UserContext);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState(user?.defaultAddress?.id || 'new');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    number: '',
    apartment: '',
    notes: ''
  });
  const [adresses, setAdresses] = useState([]);


  useEffect(() => {
    if (user?.data) {
      const idcliente = user.data.id_usuario;
      const url = `http://localhost:80/api/getadresses/${idcliente}`;
      axios.get(url).then((response) => {
        if (Array.isArray(response.data)) {
          // Asegurarse de que el precio sea numérico
          setAdresses(
            response.data.map((adresses) => ({
              ...adresses,
            }))
          );
        } else {
          console.error('La respuesta de la API no es un array:', response.data);
          setProducts([]);
        }
      })
      .catch((error) => {
        console.error('Hubo un error al obtener los productos: ', error);
      });
  }}, []);






  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.value);
  };

  const handleAddressChange = (addressId) => {
    setSelectedAddressId(addressId);
    setShowNewAddressForm(addressId === 'new');
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setShowNewAddressForm(false);
  };

  return (
    <>
      <NavBar />
      <ChakraProvider>
        <div className="checkout-container">
          <div className="checkout-main">
            <Tabs isFitted variant="enclosed" className="checkout-tabs">
              <TabList className="tab-list">
                <Tab className="tab-button">
                  <MapPin className="tab-icon" />
                  Envío a domicilio
                </Tab>
                <Tab className="tab-button">
                  <CreditCard className="tab-icon" />
                  Entrega en mesa
                </Tab>
              </TabList>
              
              <TabPanels>
                <TabPanel>
                  <div className="delivery-section">
                    <div className="address-section">
                      <h2 className="section-title">Dirección de envío</h2>

                      <div className="address-options">
                      {adresses.map((address, index) => (
                      <label key={index} className="address-option">
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddressId === address.id}
                          onChange={() => handleAddressChange(address.id)}
                          className="address-radio"
                        />
                        <div className="address-card">
                          <MapPin className="address-icon" />
                          <div className="address-details">
                            <p className="street">{address.calle} {address.n_puerta}</p>
                            {address.apto && <p className="apartment">Apto: {address.apto}</p>} 
                            {address.referencia && <p className="notes">{address.referencia}</p>}
                          </div>
                        </div>
                      </label>
                    ))}

                        <label className="address-option">
                          <input
                            type="radio"
                            name="address"
                            value="new"
                            checked={selectedAddressId === 'new'}
                            onChange={() => handleAddressChange('new')}
                            className="address-radio"
                          />
                          <div className="address-card new-address-card">
                            <PlusCircle className="address-icon" />
                            <span className="new-address-text">Nueva dirección</span>
                          </div>
                        </label>
                      </div>

                      {selectedAddressId === 'new' && (
                        <form className="new-address-form" onSubmit={handleAddressSubmit}>
                          <div className="form-row">
                            <input
                              type="text"
                              placeholder="Calle"
                              className="form-input"
                              value={newAddress.street}
                              onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                            />
                            <input
                              type="text"
                              placeholder="Número"
                              className="form-input"
                              value={newAddress.number}
                              onChange={(e) => setNewAddress({...newAddress, number: e.target.value})}
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Apartamento (Opcional)"
                            className="form-input"
                            value={newAddress.apartment}
                            onChange={(e) => setNewAddress({...newAddress, apartment: e.target.value})}
                          />
                          <textarea
                            placeholder="Notas de entrega (ej: Puerta negra, timbre no funciona)"
                            className="form-textarea"
                            value={newAddress.notes}
                            onChange={(e) => setNewAddress({...newAddress, notes: e.target.value})}
                          />
                          <div className="form-buttons">
                            <button type="submit" className="save-btn">Guardar</button>
                            <button 
                              type="button" 
                              className="cancel-btn"
                              onClick={() => handleAddressChange(user?.defaultAddress?.id || user?.addresses?.[0]?.id)}
                            >
                              Cancelar
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    <div className="payment-section">
                      <h2>Método de Pago</h2>
                      <div className="payment-options">
                        <label className="payment-option">
                          <input
                            type="radio"
                            name="payment"
                            value="efectivo"
                            onChange={handlePaymentChange}
                          />
                          <Banknote className="payment-icon" />
                          <span>Efectivo</span>
                        </label>
                        <label className="payment-option">
                          <input
                            type="radio"
                            name="payment"
                            value="tarjeta"
                            onChange={handlePaymentChange}
                          />
                          <CreditCard className="payment-icon" />
                          <span>Tarjeta</span>
                        </label>
                      </div>

                      {selectedPayment === 'efectivo' && (
                        <div className="cash-payment-details">
                          <h3>¿Necesita cambio?</h3>
                          <div className="change-options">
                            <label>
                              <input type="radio" name="change" value="si" />
                              <span>Sí</span>
                            </label>
                            <label>
                              <input type="radio" name="change" value="no" />
                              <span>No</span>
                            </label>
                          </div>
                          <input
                            type="number"
                            placeholder="Monto con el que pagará"
                            className="form-input"
                          />
                        </div>
                      )}

                      {selectedPayment === 'tarjeta' && (
                        <div className="card-payment-details">
                          <input
                            type="text"
                            placeholder="Número de Tarjeta"
                            className="form-input"
                          />
                          <input
                            type="text"
                            placeholder="Nombre en la Tarjeta"
                            className="form-input"
                          />
                          <div className="form-row">
                            <input
                              type="text"
                              placeholder="MM/AA"
                              className="form-input"
                            />
                            <input
                              type="text"
                              placeholder="CVV"
                              className="form-input"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="table-section">
                    <h2>Número de mesa</h2>
                    <input
                      type="number"
                      placeholder="Ingrese el número de mesa"
                      className="form-input"
                    />
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>

          <div className="checkout-summary">
            <CartSummary isCheckout={true} />
            <button className="checkout-btn">
              Realizar pedido
            </button>
          </div>
        </div>
      </ChakraProvider>
    </>
  );
}