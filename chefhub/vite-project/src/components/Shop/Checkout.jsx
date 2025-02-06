import React, { useState, useContext, useEffect } from 'react';
import './Checkout.css';
import { ChakraProvider, Tabs, TabList, Tab, TabPanels, TabPanel, useToast } from '@chakra-ui/react';
import { PlusCircle, MapPin, CreditCard, Banknote } from 'lucide-react';
import NavBar from '../Home/NavBar';
import { CartContext } from '../../context/cart';
import { UserContext } from '../../context/user';
import CartSummary from './CartSummary';
import axios from 'axios';

export default function Checkout() {
  const { user } = useContext(UserContext);
  const { cartItems, clearCart } = useContext(CartContext);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState(
    user?.defaultAddress?.id_direccion || 'new'
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [OrderCategorie, setOrderCategorie] = useState('');
  const toast = useToast();

  // Estado para datos de tarjeta
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // Estado para errores de tarjeta
  const [cardErrors, setCardErrors] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // Estado para dirección
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
    setOrderCategorie(selectedTab === 0 ? "Delivery" : "Mesa");
  }, [selectedTab]);

  // Función para cargar direcciones
  const loadAddresses = async () => {
    if (user?.data) {
      try {
        const idcliente = user.data.id_usuario;
        const url = `http://localhost:80/api/getadresses/${idcliente}`;
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

  // Validación de tarjeta
  const validateCardData = () => {
    const errors = {
      number: '',
      name: '',
      expiry: '',
      cvv: ''
    };
    let isValid = true;

    // Validar número de tarjeta (16 dígitos)
    if (!/^\d{16}$/.test(cardData.number.replace(/\s/g, ''))) {
      errors.number = 'El número de tarjeta debe tener 16 dígitos';
      isValid = false;
    }

    // Validar nombre
    if (!/^[a-zA-Z\s]+$/.test(cardData.name)) {
      errors.name = 'Ingrese un nombre válido';
      isValid = false;
    }

    // Validar fecha de expiración (MM/YY)
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

    // Validar CVV (3 dígitos)
    if (!/^\d{3}$/.test(cardData.cvv)) {
      errors.cvv = 'El CVV debe tener 3 dígitos';
      isValid = false;
    }

    setCardErrors(errors);
    return isValid;
  };

  const handleOrderSubmit = async () => {
    if (selectedPayment === "tarjeta" && !validateCardData()) {
      toast({
        title: "Error de validación",
        description: "Por favor, corrija los errores en los datos de la tarjeta",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    const Order = {
      id_cliente: user?.data?.id_cliente || null,
      id_direccion: OrderCategorie === "Mesa" ? null : selectedAddressId, // Si la categoría es "Mesa", id_direccion será null
      total: cartTotal,
      metodo_pago: selectedPayment,
      productos: cartItems,
      estado: "Pendiente",
      categoria: OrderCategorie,
    };

    try {
      const response = await fetch("http://localhost/api/insertorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Order),
      });
  
      const result = await response.json();
  
      if (result.success) {
        toast({
          title: "Pedido realizado",
          description: "Su pedido ha sido procesado con éxito",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        clearCart();
      } else {
        toast({
          title: "Error",
          description: result.error || "Error desconocido",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
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
  

  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.value);
    // Limpiar datos de tarjeta al cambiar método de pago
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
  };

  const handleAddressChange = (addressId) => {
    setSelectedAddressId(addressId);
    setShowNewAddressForm(addressId === 'new');
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
      const response = await fetch("http://localhost/api/insertaddress", {
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
        
        // Limpiar el formulario
        setNewAddress({
          id_usuario: user?.data?.id_usuario || null,
          calle: '',
          apto: '',
          n_puerta: '',
          referencia: ''
        });
        
        // Recargar las direcciones
        await loadAddresses();
        
        // Cerrar el formulario
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

  // Formatear número de tarjeta
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

  const handleCardInput = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiry') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substr(0, 5);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substr(0, 3);
    }

    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
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
                  <div className="delivery-section">
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
                              placeholder="Calle"
                              className="form-input"
                              value={newAddress.calle}
                              onChange={(e) => setNewAddress({...newAddress, calle: e.target.value})}
                              required
                            />
                            <input
                              type="text"
                              placeholder="Número"
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
                            placeholder="Notas de entrega (ej: Puerta negra, timbre no funciona)"
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
                        </div>
                      )}

                      {selectedPayment === 'tarjeta' && (
                        <div className="card-payment-details">
                          <div className="form-group">
                            <input
                              type="text"
                              name="number"
                              placeholder="Número de Tarjeta"
                              className={`form-input ${cardErrors.number ? 'error' : ''}`}
                              value={cardData.number}
                              onChange={handleCardInput}
                              maxLength="19"
                            />
                            {cardErrors.number && <span className="error-message">{cardErrors.number}</span>}
                          </div>
                          
                          <div className="form-group">
                            <input
                              type="text"
                              name="name"
                              placeholder="Nombre en la Tarjeta"
                              className={`form-input ${cardErrors.name ? 'error' : ''}`}
                              value={cardData.name}
                              onChange={handleCardInput}
                            />
                            {cardErrors.name && <span className="error-message">{cardErrors.name}</span>}
                          </div>
                          
                          <div className="form-row">
                            <div className="form-group">
                              <input
                                type="text"
                                name="expiry"
                                placeholder="MM/YY"
                                className={`form-input ${cardErrors.expiry ? 'error' : ''}`}
                                value={cardData.expiry}
                                onChange={handleCardInput}
                                maxLength="5"
                              />
                              {cardErrors.expiry && <span className="error-message">{cardErrors.expiry}</span>}
                            </div>
                            
                            <div className="form-group">
                              <input
                                type="text"
                                name="cvv"
                                placeholder="CVV"
                                className={`form-input ${cardErrors.cvv ? 'error' : ''}`}
                                value={cardData.cvv}
                                onChange={handleCardInput}
                                maxLength="3"
                              />
                              {cardErrors.cvv && <span className="error-message">{cardErrors.cvv}</span>}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="checkout-btn-container">
                        <button 
                          className="checkout-btn" 
                          onClick={handleOrderSubmit}
                          disabled={!selectedPayment || (selectedTab === 0 && selectedAddressId === 'new')}
                        >
                          Realizar pedido
                        </button>
                      </div>
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
          </div>
        </div>
      </ChakraProvider>
    </>
  );
}