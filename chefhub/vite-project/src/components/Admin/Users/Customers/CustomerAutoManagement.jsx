import React, { useState,useEffect,useContext } from 'react';

import { ChakraProvider, Tabs, TabList, Tab, TabPanels, TabPanel, useToast } from '@chakra-ui/react';
import { 
  User, 
  Mail, 
  MapPin, 
  Key, 
  Edit2, 
  X,
  Package,
  Clock,
  Calendar,
  DollarSign,
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
        const response = await fetch("http://localhost/api/getmyorders", {
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
        const response = await fetch("http://localhost/api/getmyreservations", {
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

  const HandleDeleteDir = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost/api/deleteaddress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_direccion: selectedAddressId })
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

        const responseCheck = await fetch('http://localhost/api/checkpassword', {
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

        const responseUpdate = await fetch('http://localhost/api/updatepassword', {
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
        const response = await fetch('http://localhost/api/updatename', {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-700 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-purple-700">Información Personal</h2>
              <button
                onClick={() => setIsEditingProfile(true)}
                className="text-purple-600 hover:text-purple-800"
              >
                <Edit2 size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="text-purple-600" />
                <span>{user.data.nombre}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span>{user.data.apellido}</span>
              </div>
              <button
                onClick={() => setIsEditingPassword(true)}
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-800"
              >
                <Key size={20} />
                <span>Cambiar contraseña</span>
              </button>
            </div>  
          </div>

          

          {/* Orders Table */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">Mis Pedidos</h2>
            <div className="overflow-x-auto">
            <table className="w-full text-white border-collapse">
  <thead>
    <tr className="bg-gray-800">
      <th className="p-2 border border-gray-700">ID Pedido</th>
      <th className="p-2 border border-gray-700">Fecha y Hora</th>
      <th className="p-2 border border-gray-700">Subtotal</th>
      <th className="p-2 border border-gray-700">Estado</th>
      <th className="p-2 border border-gray-700">Productos</th>
    </tr>
  </thead>
  <tbody>
    {myorders?.map((order) => (
      <tr key={order.id_pedido} className="bg-gray-900">
        <td className="p-2 border border-gray-700">{order.id_pedido}</td>
        <td className="p-2 border border-gray-700">{order.fecha_hora}</td>
        <td className="p-2 border border-gray-700">${order.subtotal}</td>
        <td className="p-2 border border-gray-700">{order.estado}</td>
        <td className="p-2 border border-gray-700">
          <ul>
            {Object.values(order.productos).map((producto, index) => (
              <li key={index} className="mb-2">
                <strong>{producto.nombre}</strong> - ${producto.importe} ({producto.cantidad}x)
                {producto.nota && <p className="text-sm italic">Nota: {producto.nota}</p>}
                {producto.ingredientes.length > 0 && (
                  <ul className="text-xs">
                    {producto.ingredientes.map((ing, i) => (
                      <li key={i} className="ml-4">• {ing.nombre} (x{ing.cantidad})</li>
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
        </div>
      </div>
    {/* Reservations Table */}
<div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-purple-700 mb-4">Mis Reservas</h2>
  <div className="overflow-x-auto">
    <table className="w-full text-white border-collapse">
      <thead>
        <tr className="bg-gray-800">
          <th className="p-2 border border-gray-700">ID Mesa</th>
          <th className="p-2 border border-gray-700">Fecha y Hora</th>
          <th className="p-2 border border-gray-700">Cantidad de Personas</th>
          <th className="p-2 border border-gray-700">Nombre Reserva</th>
          <th className="p-2 border border-gray-700">Tel. Contacto</th>
          <th className="p-2 border border-gray-700">Estado</th>
        </tr>
      </thead>
      <tbody>
        {myreservations?.map((reservation) => (
          <tr key={reservation.id_mesa} className="bg-gray-900">
            <td className="p-2 border border-gray-700">{reservation.id_mesa}</td>
            <td className="p-2 border border-gray-700">{`${reservation.fecha} ${reservation.hora}`}</td>
            <td className="p-2 border border-gray-700">{reservation.cant_personas}</td>
            <td className="p-2 border border-gray-700">{reservation.nombre_reserva}</td>
            <td className="p-2 border border-gray-700">{reservation.tel_contacto}</td>
            <td className="p-2 border border-gray-700">{reservation.estado}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-purple-700">Editar Perfil</h3>
              <button onClick={() => setIsEditingProfile(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Apellido</label>
                <input
                  type="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                  onClick={HandleUpdateProfile}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isEditingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-purple-700">Cambiar Contraseña</h3>
              <button onClick={() => setIsEditingPassword(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña Actual</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditingPassword(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                  onClick={HandleCheckandUpdatePassword}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
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
                   <MapPin className="address-icon" />
                   <div className="address-details">
                     <p className="street">{address.calle} {address.n_puerta}</p>
                     {address.apto && <p className="apartment">Apto: {address.apto}</p>} 
                     {address.referencia && <p className="notes">{address.referencia}</p>}
                   </div>

                   <button className='cancel-btn' onClick={HandleDeleteDir}> x</button>
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
         </div>
    </div>
  );
}

export default CustomerAutoManagement;