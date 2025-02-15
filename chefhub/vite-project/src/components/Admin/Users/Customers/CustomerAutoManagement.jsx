import React, { useState,useEffect,useContext } from 'react';

import { ChakraProvider, Tabs, TabList, Tab, TabPanels, TabPanel, useToast } from '@chakra-ui/react';
import { 
  User,
  MapPin, 
  Key, 
  Edit2, 
  X,
  PlusCircle
} from 'lucide-react';

import axios from 'axios';
import './CustomerAutoManagement.css';
import { UserContext } from '../../../../context/user';

// Mock data for demonstration
const mockUser = {
  name: "",
  email: "juan@example.com",
  addresses: [
    "Calle 123, Esquina Principal",
    "Avenida Central 456, Esquina Segunda"
  ]
};
const mockOrders = [
  {
    id: "001",
    date: "2024-03-10",
    time: "19:30",
    items: "Pizza Margherita x2",
    total: 25.99,
    status: "Entregado"
  },
  {
    id: "002",
    date: "2024-03-12",
    time: "20:15",
    items: "Pasta Carbonara x1, Tiramisú x1",
    total: 32.50,
    status: "En preparación"
  }
];

function CustomerAutoManagement() {
  const { user, login } = useContext(UserContext);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [userData, setUserData] = useState(mockUser);
  const [myorders, setMyOrders] = useState();
  const [myreservations, setMyReservations] = useState();
  const [adresses, setAdresses] = useState([]);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const toast = useToast();
  
  const [selectedAddressId, setSelectedAddressId] = useState(
      user?.defaultAddress?.id_direccion || 'new'
    );
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newAddress: ''
  });
   const [newAddress, setNewAddress] = useState({
      calle: '',
      apto: '',
      n_puerta: '',
      referencia: '',
      id_usuario: user?.data?.id_usuario || null
    });

useEffect(() => {
  const fetchOrders = async () => {
    if (user?.data) {
      try {
        const response = await fetch("http://192.168.0.10:8080/api/getmyorders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_cliente:user.data.id_cliente}),
        });
        const result = await response.json();
        if (result.success) {
          setMyOrders(result.data);
        } else {
          console.error('Error al cargar los pedidoss:', result.error);
          setMyOrders([]);
        }
      } catch (error) {
        console.error('Error al cargar los pedidos:', error);
        setMyOrders([]);
      }
    }
  };
  fetchOrders();
}, [user]);


useEffect(() => {
  const fetchReservations = async () => {
    if (user?.data) {
      try {
        const response = await fetch("http://192.168.0.10:8080/api/getmyreservations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_cliente:user.data.id_cliente}),
        });
        const result = await response.json();
        if (result.success) {
          setMyReservations(result.data);
        } else {
          console.error('Error al cargar las reservas:', result.error);
          setMyReservations([]);
        }
      } catch (error) {
        console.error('Error al cargar las reservas:', error);
        setMyReservations([]);
      }
    }
  };
  fetchReservations();
}, [user]);
  
  const loadAddresses = async () => {
    if (user?.data) {
      try {
        const idcliente = user.data.id_usuario;
        const url = `http://192.168.0.10:8080:80/api/getadresses/${idcliente}`;
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

  const HandleDeleteDir = async (e,id) => {
    e.preventDefault();
    try {
      const response = await fetch("http://192.168.0.10:8080/api/deleteaddress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_direccion: id})
      });
      console.log(selectedAddressId);
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Dirección eliminada',
          description: 'La dirección se eliminó correctamente',
          status: 'success',
          duration: 3000,
          isClosable: true
        });

        await loadAddresses();
      setSelectedAddressId(null);

      } else {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar la dirección',
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
  const HandleCheckandUpdatePassword = async (e) => {
    e.preventDefault();

    try {

        const responseCheck = await fetch('http://192.168.0.10:8080/api/checkpassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({ password: formData.currentPassword, id_usuario: user.data.id_usuario }),
        });

        if (!responseCheck.ok) {

            alert('La contraseña actual no es correcta.');
            return;
        }

        const responseUpdate = await fetch('http://192.168.0.10:8080/api/updatepassword', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword: formData.newPassword, id_usuario: user.data.id_usuario }),
        });

        if (responseUpdate.ok) {
            alert('Contraseña actualizada correctamente.');
        } else {
            alert('Hubo un error al actualizar la contraseña.');
        }
    } catch (error) {
        console.error('Error al realizar la petición:', error);
        alert('Ocurrió un error, intentalo nuevamente.');
    }
};


const HandleUpdateProfile = async (e) => {
    e.preventDefault();// Obtener user y login desde el contexto

    try {
        const response = await fetch('http://192.168.0.10:8080/api/updatename', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_usuario: user.data.id_usuario,
                nombre: formData.name,
                apellido: formData.apellido
            }),
        });

        if (response.ok) {
            alert('Nombre actualizado correctamente.');

            // Obtener el usuario actualizado
            const updatedUser = {
                ...user,
                data: {
                    ...user.data,
                    nombre: formData.name,
                    apellido: formData.apellido
                }
            };

            // 🔹 Llamar a login con los nuevos datos
            login(updatedUser);

        } else {
            alert('Hubo un error al actualizar el nombre.');
        }
    } catch (error) {
        console.error('Error al realizar la petición:', error);
        alert('Ocurrió un error, inténtalo nuevamente.');
    }
};








  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Entregado':
        return 'bg-green-100 text-green-800';
      case 'En preparación':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <h1 className="profile-title">Mi Perfil</h1>
        </div>
      </div>
  
      {/* Main Content */}
      <div className="profile-main-content">
        <div className="main-content-wrapper">
          {/* Profile Information */}
          <div className="profile-info">
            <div className="profile-info-header">
              <h2 className="profile-info-title">Información Personal</h2>
              <button onClick={() => setIsEditingProfile(true)} className="edit-profile-btn">
                <Edit2 size={20} />
              </button>
            </div>
            <div className="profile-details">
              <div className="user-name">
                <User className="user-icon" />
                <span className="user-name-text">{user.data.nombre}</span>
                <span className="user-last-name-text">{user.data.apellido}</span>
              </div>
              <button onClick={() => setIsEditingPassword(true)} className="change-password-btn">
                <Key size={20} />
                <span>Cambiar contraseña</span>
              </button>
            </div>  
          </div>
  
          {/* Orders Table */}
          <div className="orders-section">
            <h2 className="orders-title">Mis Pedidos</h2>
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr className="table-header">
                    <th className="table-header-item">ID Pedido</th>
                    <th className="table-header-item">Fecha y Hora</th>
                    <th className="table-header-item">Subtotal</th>
                    <th className="table-header-item">Estado</th>
                    <th className="table-header-item">Productos</th>
                  </tr>
                </thead>
                <tbody>
                  {myorders?.map((order) => (
                    <tr key={order.id_pedido} className="order-row">
                      <td className="order-id">{order.id_pedido}</td>
                      <td className="order-date-time">{order.fecha_hora}</td>
                      <td className="order-subtotal">${order.subtotal}</td>
                      <td className="order-status">{order.estado}</td>
                      <td className="order-products">
                        <ul className="product-list">
                          {Object.values(order.productos).map((producto, index) => (
                            <li key={index} className="product-item">
                              <strong className="product-name">{producto.nombre}</strong> - ${producto.importe} ({producto.cantidad}x)
                              {producto.nota && <p className="product-note">Nota: {producto.nota}</p>}
                              {producto.ingredientes.length > 0 && (
                                <ul className="ingredients-list">
                                  {producto.ingredientes.map((ing, i) => (
                                    <li key={i} className="ingredient-item">• {ing.nombre} (x{ing.cantidad})</li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
  
          {/* Reservations Table */}
          <div className="reservations-section">
            <h2 className="reservations-title">Mis Reservas</h2>
            <div className="reservations-table-container">
              <table className="reservations-table">
                <thead>
                  <tr className="table-header">
                    <th className="table-header-item">ID Mesa</th>
                    <th className="table-header-item">Fecha y Hora</th>
                    <th className="table-header-item">Cantidad de Personas</th>
                    <th className="table-header-item">Nombre Reserva</th>
                    <th className="table-header-item">Tel. Contacto</th>
                    <th className="table-header-item">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {myreservations?.map((reservation) => (
                    <tr key={reservation.id_mesa} className="reservation-row">
                      <td className="reservation-id">{reservation.id_mesa}</td>
                      <td className="reservation-date-time">{`${reservation.fecha} ${reservation.hora}`}</td>
                      <td className="reservation-persons">{reservation.cant_personas}</td>
                      <td className="reservation-name">{reservation.nombre_reserva}</td>
                      <td className="reservation-contact">{reservation.tel_contacto}</td>
                      <td className="reservation-status">{reservation.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
  
        </div>
      </div>
  
      {isEditingProfile && (
        <div className="modal-overlay-profile">
          <div className="modal-container-profile">
            <div className="modal-header-profile">
              <h3 className="modal-title-profile">Editar Perfil</h3>
              <button onClick={() => setIsEditingProfile(false)} className="close-modal-btn-profile">
                <X size={20} />
              </button>
            </div>
            <form className="profile-form-profile">
              <div className="form-row-profile">
                <label className="form-label-profile">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input-profile"
                />
              </div>
              <div className="form-row-profile">
                <label className="form-label-profile">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className="form-input-profile"
                />
              </div>
              <div className="form-buttons-profile">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="cancel-btn-profile"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="save-btn-profile"
                  onClick={HandleUpdateProfile}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
  
      {isEditingPassword && (
        <div className="modal-overlay-profile-password">
          <div className="modal-container-profile-password">
            <div className="modal-header-profile-password">
              <h3 className="modal-title">Cambiar Contraseña</h3>
              <button onClick={() => setIsEditingPassword(false)} className="close-modal-btn-profile-password">
                <X size={20} />
              </button>
            </div>
            <form className="password-form-profile">
              <div className="form-row-profile">
                <label className="form-label-profile">Contraseña Actual</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="form-input-profile"
                />
              </div>
              <div className="form-row-profile">
                <label className="form-label-profile">Nueva Contraseña</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="form-input-profile"
                />
              </div>
              <div className="form-row-profile">
                <label className="form-label-profile">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input-profile"
                />
              </div>
              <div className="form-buttons-profile">
                <button
                  type="button"
                  onClick={() => setIsEditingPassword(false)}
                  className="cancel-btn-profile"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="save-btn-profile"
                  onClick={HandleCheckandUpdatePassword}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
  
      <div className="delivery-section">
        <div className="address-section">
          <h2 className="section-title">Direcciones</h2>
  
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
                  <div className="address-details">
                    <p className="street">{address.calle} {address.n_puerta}</p>
                    {address.apto && <p className="apartment">Apto: {address.apto}</p>} 
                    {address.referencia && <p className="notes">{address.referencia}</p>}
                  </div>
                  <button className='cancel-btn-profile' onClick={(e) => HandleDeleteDir(e, address.id_direccion)}> x</button>

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
            <form className="new-address-form-profile" onSubmit={handleAddAddress}>
              <div className="form-row-profile">
                <input
                  type="text"
                  placeholder="Calle"
                  className="form-input-profile"
                  value={newAddress.calle}
                  onChange={(e) => setNewAddress({...newAddress, calle: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Número"
                  className="form-input-profile"
                  value={newAddress.n_puerta}
                  onChange={(e) => setNewAddress({...newAddress, n_puerta: e.target.value})}
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Apartamento (Opcional)"
                className="form-input-profile"
                value={newAddress.apto}
                onChange={(e) => setNewAddress({...newAddress, apto: e.target.value})}
              />
              <textarea
                placeholder="Notas de entrega (ej: Puerta negra, timbre no funciona)"
                className="form-textarea-profile"
                value={newAddress.referencia}
                onChange={(e) => setNewAddress({...newAddress, referencia: e.target.value})}
              />
              <div className="form-buttons-profile">
                <button type="submit" className="save-btn-profile">Guardar</button>
                <button 
                  type="button" 
                  className="cancel-btn-profile"
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
      </div>
    </div>
  );
  
}

export default CustomerAutoManagement;