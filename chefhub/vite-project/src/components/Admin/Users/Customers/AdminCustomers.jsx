import React, { useState, useEffect } from 'react';
import { useToast, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Text } from '@chakra-ui/react';
import { NewIcon, EditIcon, ClearIcon, EyeIcon, CloseIcon2 } from '../../../../img/HeroIcons';
import { fetchData } from '../../apiService';
import './AdminCustomers.css';

const AdminCustomers = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [addressData, setAddressData] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const itemsPerPage = 12;

  const toast = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    fetchData('http://192.168.0.10:8080/api/customers', setData);
  };

  const fetchAddress = async (id_cliente) => {
    setLoadingAddress(true);
    try {
      const response = await fetch(`http://192.168.0.10:8080/api/getadresses/${id_cliente}`);
      const data = await response.json();
      setAddressData(data);
    } catch (error) {
      console.error('Error al obtener las direcciones:', error);
    } finally {
      setLoadingAddress(false);
      setModalVisible(true);
    }
  };

  const confirmDelete = (client) => {
    setSelectedClient(client);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedClient) return;

    try {
      const response = await fetch("http://192.168.0.10:8080/api/customers/deletecustomers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_usuario: selectedClient.id_cliente }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Cliente dado de baja",
          description: "El cliente se ha dado de baja con éxito",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        fetchCustomers(); // Refresca la lista de clientes
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

    setDeleteModalOpen(false);
  };

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const visibleColumns = currentData.length > 0
    ? Object.keys(currentData[0]).filter((key) => key !== 'id_cliente' && key !== 'id') // Oculta las columnas de ID
    : [];

  return (
    <div>
      <div className="admin-format">
        <div className="admin-title title-customers">
          <h2>CLIENTES</h2>
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
        </div>

        <div className="admin-table">
          <table>
            <thead>
              <tr>
                {visibleColumns.map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Direcciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id_cliente}>
                  {visibleColumns.map((key, idx) => (
                    <td key={idx}>
                      {key === 'Foto' ? (
                        <img
                          src={item[key]}
                          alt={`Foto de ${item.Nombre || 'cliente'}`}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      ) : (
                        item[key]
                      )}
                    </td>
                  ))}
                  <td>
                    <button className="admin-btn-view" onClick={() => fetchAddress(item.id_cliente)}>
                      <EyeIcon />
                    </button>
                  </td>
                  <td>
                    <button className="admin-btn" onClick={() => handleEdit(item.id_cliente)}>
                      <EditIcon />
                    </button>
                    <button className="admin-btn" onClick={() => confirmDelete(item)}>
                      <ClearIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length > itemsPerPage && (
          <div className="pagination">
            <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1} className="admin-btn">
              Anterior
            </button>
            <span>{currentPage} de {totalPages}</span>
            <button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages} className="admin-btn">
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal de confirmación para eliminar cliente */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar eliminación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>¿Estás seguro de que deseas eliminar a este cliente?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleDelete}>Eliminar</Button>
            <Button onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de direcciones */}
      {modalVisible && (
        <div className="modal-overlay-address">
          <div className="modal-content-address">
            <div className='modal-header-address'>
              <h3>Direcciones del cliente</h3>
              <a onClick={() => setModalVisible(false)}><CloseIcon2 /></a>
            </div>
            {loadingAddress ? (
              <p>Cargando...</p>
            ) : addressData.length > 0 ? (
              <table className='address-table'>
                <thead>
                  <tr><th>Calle</th><th>N° Puerta</th><th>Apto</th><th>Referencia</th></tr>
                </thead>
                <tbody>
                  {addressData.map((address, idx) => (
                    <tr key={idx}><td>{address.calle}</td><td>{address.n_puerta}</td><td>{address.apto}</td><td>{address.referencia}</td></tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No se encontraron direcciones.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
