import React, { useState, useContext, useEffect } from 'react';
import './Checkout.css';
import { ChakraProvider, Tabs, TabList, Tab, TabPanels, TabPanel, useToast } from '@chakra-ui/react';
import { PlusCircle, MapPin, CreditCard, Banknote } from 'lucide-react';
import NavBar from '../Home/NavBar';
import { CartContext } from '../../context/cart';
import { UserContext } from '../../context/user';
import CartSummary from './CartSummary';
import axios from 'axios';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import {Link, useNavigate} from 'react-router-dom';

initMercadoPago('APP_USR-c4ae400c-ca0c-4d11-bf66-634b6910a8aa');

export default function Checkout() {
  const { user } = useContext(UserContext);
  const { cartItems, clearCart, addOrder, clearOrder } = useContext(CartContext);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState(
    user?.defaultAddress?.id_direccion || 'new'
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [OrderCategorie, setOrderCategorie] = useState('');
  const [preferenceId, setPreferenceId] = useState('');
  const [cartInteracted, setCartInteracted] = useState(false);
  const [TableNumber, setTableNumber] = useState('');
  const toast = useToast();

  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [cardErrors, setCardErrors] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [newAddress, setNewAddress] = useState({
    calle: '',
    apto: '',
    n_puerta: '',
    referencia: '',
    id_usuario: user?.data?.id_usuario || null
  });
  const [adresses, setAdresses] = useState([]);

  useEffect(() => {
    const total = cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
    setCartTotal(total);
  }, [cartItems]);

  useEffect(() => {
  console.log("selectedTab cambió a:", selectedTab);
  setOrderCategorie(selectedTab === 0 ? "Delivery" : "Mesa");
}, [selectedTab]);

  const loadAddresses = async () => {
    if (user?.data) {
      try {
        const idcliente = user.data.id_usuario;
        const url = `http://192.168.0.10:8080/api/getadresses/${idcliente}`;
        const response = await axios.get(url);
        if (Array.isArray(response.data)) {
          setAdresses(response.data);
        } else {
          console.error('La respuesta de la API no es un array:', response.data);
          setAdresses([]);
        }
      } catch (error) {
        console.error('Error al cargar las direcciones:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las direcciones',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [user]);

  const validateCardData = () => {
    const errors = {
      number: '',
      name: '',
      expiry: '',
      cvv: ''
    };
    let isValid = true;

    if (!/^\d{16}$/.test(cardData.number.replace(/\s/g, ''))) {
      errors.number = 'El número de tarjeta debe tener 16 dígitos';
      isValid = false;
    }

    if (!/^[a-zA-Z\s]+$/.test(cardData.name)) {
      errors.name = 'Ingrese un nombre válido';
      isValid = false;
    }

    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardData.expiry)) {
      errors.expiry = 'Formato inválido (MM/YY)';
      isValid = false;
    } else {
      const [month, year] = cardData.expiry.split('/');
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      if (expiry < new Date()) {
        errors.expiry = 'La tarjeta está vencida';
        isValid = false;
      }
    }

    if (!/^\d{3}$/.test(cardData.cvv)) {
      errors.cvv = 'El CVV debe tener 3 dígitos';
      isValid = false;
    }

    setCardErrors(errors);
    return isValid;
  };

  const handleOrderSubmit = async () => {
    const Order = {
      id_cliente: user?.data?.id_cliente || null,
      id_direccion: OrderCategorie === "Mesa" ? null : selectedAddressId,
      total: cartTotal,
      metodo_pago: selectedPayment,
      productos: cartItems,
      estado: "Pendiente",
      categoria: OrderCategorie,
      id_mesa: TableNumber,
    };
    addOrder(Order);

    try {
      const preferenceResponse = await axios.post('http://192.168.0.10:8080/api/payment', {
        items: cartItems.map(item => ({
          title: item.name,
          quantity: 1,
          unit_price: item.price,
        })),
      });
      console.log(cartItems);
      if (preferenceResponse?.data) {
        const preferenceId = preferenceResponse.data.preference_id;
  

        if (preferenceId) {
          console.log('Preference ID:', preferenceId);
          setPreferenceId(preferenceId);
        } else {
          throw new Error("No se recibió un preferenceId válido.");
        }

      } else {
        throw new Error("Error en la respuesta de la API.");
      }

    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

// Este effect se ejecuta cada vez que tableNumber cambia

  const handleOrderSubmitToBD = async () => {
    if (TableNumber.trim() === '') {
      alert('Por favor, ingrese un número de mesa válido');
      return;
    }

    // Aquí creamos el objeto Order
    const Order = {
      id_cliente: user?.data?.id_cliente || null,
      id_direccion: OrderCategorie === "Mesa" ? null : selectedAddressId,
      total: cartTotal,
      metodo_pago: selectedPayment,
      productos: cartItems,
      estado: "Pendiente",
      categoria: OrderCategorie,
      id_mesa: TableNumber,  // Asegúrate de que TableNumber tiene el valor esperado
    };
    console.log('Objeto Order:', Order);  // Verifica el contenido de Order en la consola

    // Aquí enviamos el objeto Order al backend
    const response = await fetch('http://192.168.0.10:8080/api/insertorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Order), // Enviamos el objeto Order
    });

    const result = await response.json();

    if (result.success) {
      alert('Pedido realizado con éxito');
      clearCart();
      // Aquí podrías redirigir o limpiar el estado si es necesario
    } else {
      alert('Hubo un error al realizar el pedido');
    }
  };

  // Verificar si se puede seleccionar método de pago
  const canSelectPayment = () => {
    if (selectedTab === 0) { // Solo para delivery
      if (selectedAddressId === 'new') {
        return newAddress.calle.trim() !== '' && newAddress.n_puerta.trim() !== '';
      }
      return selectedAddressId !== '';
    }
    return true; // Para mesa siempre se puede seleccionar
  };

  const handlePaymentChange = (event) => {
    if (canSelectPayment()) {
      setSelectedPayment(event.target.value);
      if (event.target.value !== 'tarjeta') {
        setCardData({
          number: '',
          name: '',
          expiry: '',
          cvv: ''
        });
        setCardErrors({
          number: '',
          name: '',
          expiry: '',
          cvv: ''
        });
      }
    }
  };

  const handleAddressChange = (addressId) => {
    setSelectedAddressId(addressId);
    setShowNewAddressForm(addressId === 'new');
    setSelectedPayment(''); // Reset payment when address changes
  };

  const handleCartInteraction = () => {
    setCartInteracted(true);
    setSelectedPayment('');
  };
  const handleCheckoutInteraction = () => {
    setCartInteracted(false);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    if (!newAddress.calle || !newAddress.n_puerta) {
      toast({
        title: 'Error',
        description: 'La calle y el número son obligatorios',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    try {
      const response = await fetch("http://192.168.0.10:8080/api/insertaddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAddress),
      });
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Dirección agregada',
          description: 'La dirección se agregó correctamente',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        
        setNewAddress({
          id_usuario: user?.data?.id_usuario || null,
          calle: '',
          apto: '',
          n_puerta: '',
          referencia: ''
        });
        
        await loadAddresses();
        setShowNewAddressForm(false);
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo agregar la dirección',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  
  return (
    <>
      <NavBar />
      <ChakraProvider>
        <div className="checkout-container">
          <div className="checkout-main">
            <Tabs index={selectedTab} onChange={(index) => setSelectedTab(index)} isFitted variant="enclosed">
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
                  <div className="delivery-section" onClick={handleCheckoutInteraction}>
                    <div className="address-section">
                      <h2 className="section-title">Dirección de envío</h2>

                      <div className="address-options">
                        {adresses.map((address, index) => (
                          <label key={index} className="address-option">
                            <input
                              type="radio"
                              name="address"
                              value={address.id_direccion}
                              checked={selectedAddressId === address.id_direccion}
                              onChange={() => handleAddressChange(address.id_direccion)}
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
                        <form className="new-address-form" onSubmit={handleAddAddress}>
                          <div className="form-row">
                            <input
                              type="text"
                              placeholder="Calle *"
                              className="form-input"
                              value={newAddress.calle}
                              onChange={(e) => setNewAddress({...newAddress, calle: e.target.value})}
                              required
                            />
                            <input
                              type="text"
                              placeholder="Número *"
                              className="form-input"
                              value={newAddress.n_puerta}
                              onChange={(e) => setNewAddress({...newAddress, n_puerta: e.target.value})}
                              required
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Apartamento (Opcional)"
                            className="form-input"
                            value={newAddress.apto}
                            onChange={(e) => setNewAddress({...newAddress, apto: e.target.value})}
                          />
                          <textarea
                            placeholder="Notas de entrega (Opcional)"
                            className="form-textarea"
                            value={newAddress.referencia}
                            onChange={(e) => setNewAddress({...newAddress, referencia: e.target.value})}
                          />
                          <div className="form-buttons">
                            <button type="submit" className="save-btn">Guardar</button>
                            <button 
                              type="button" 
                              className="cancel-btn"
                              onClick={() => {
                                setShowNewAddressForm(false);
                                setSelectedAddressId(adresses[0]?.id_direccion || 'new');
                              }}
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
                        <label className={`payment-option ${!canSelectPayment() ? 'disabled' : ''}`}>
                          <input
                            type="radio"
                            name="payment"
                            value="efectivo"
                            onChange={handlePaymentChange}
                            disabled={!canSelectPayment()}
                            checked={selectedPayment === 'efectivo'}
                          />
                          <Banknote className="payment-icon" />
                          <span>Efectivo</span>
                        </label>
                        <label className={`payment-option ${!canSelectPayment() ? 'disabled' : ''}`}>
                          <input
                            type="radio"
                            name="payment"
                            value="tarjeta"
                            onChange={handlePaymentChange}
                            disabled={!canSelectPayment()}
                            checked={selectedPayment === 'tarjeta'}
                            onClick={handleOrderSubmit}
                          />
                          <CreditCard className="payment-icon" />
                          <span>Tarjeta</span>
                        </label>
                      </div>

                      {selectedPayment === 'efectivo' && !cartInteracted && (
                        <div className="cash-payment-details">
                          <h3>¿Necesita cambio?</h3>
                          <div className="change-options">
                            <label>
                              <input type="radio" name="change" value="si" />
                              <span className='cash-options'>Sí</span>
                            </label>
                            <label>
                              <input type="radio" name="change" value="no" />
                              <span className='cash-options'>No</span>
                            </label>
                          </div>
                          <input
                            type="number"
                            placeholder="Monto con el que pagará"
                            className="form-input"
                          />
                          <Link to="/success">
                            <button 
                              className="checkout-btn" 
                              onClick={handleOrderSubmitToBD}
                              disabled={!selectedPayment || (selectedTab === 0 && !canSelectPayment())}
                            >
                              Realizar pedido
                            </button>
                          </Link>
                        </div>
                      )}

                      {selectedPayment === 'tarjeta' && !cartInteracted && (
                        <div className="card-payment-details">
                          <div id="wallet_container" className='wallet-container'>
                            <button onClick={handleOrderSubmit}>
                              <Wallet 
                                initialization={{ preferenceId }}
                              />
                            </button>
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
                      value={TableNumber} // Aseguramos que el input esté vinculado al estado
                      onChange={(e) => setTableNumber(e.target.value)} // Actualiza el estado con el valor del input

                    />
                            <Link to="/successin">
                            <button 
                              className="checkout-btn" 
                              onClick={handleOrderSubmitToBD}
                            >
                              Realizar pedido
                            </button>
                          </Link>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>

          <div className="checkout-summary" onClick={handleCartInteraction}>
            <CartSummary isCheckout={true} />
          </div>
        </div>
      </ChakraProvider>
    </>
  );
}