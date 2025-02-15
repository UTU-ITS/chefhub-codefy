import React, { useState, useEffect } from 'react';
import { NewIcon, EditIcon, ClearIcon, UserCheckIcon } from '../../../../img/HeroIcons';
import { fetchData } from '../../apiService';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@chakra-ui/react';
import AddEmployeeModal from './AddEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';

const AdminEmployees = () => {
  const [data, setData] = useState([]);
  const [dataremoved, setDataRemoved] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRemovePage, setCurrentRemovePage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null); 
  const { isOpen, onOpen, onClose } = useDisclosure(); // Hook para manejar el modal
  const itemsPerPage = 6;

  useEffect(() => {
    fetchEmployees();
    fetchRemovedEmployees();
  }, []);

  const fetchEmployees = async () => {
    await fetchData('http://chefhub.codefy.com:8080/api/empolyees', setData);
  };
  const fetchRemovedEmployees = async () => {
    await fetchData('http://chefhub.codefy.com:8080/api/getremovedemployees', setDataRemoved);
  };

  const handleEmployeeAdded = () => {
    fetchEmployees();
  };
  const handleEmployeeUpdated = () => {
    fetchEmployees();
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://chefhub.codefy.com:8080/api/deleteemployee`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_usuario : id }) // Enviar el ID en JSON

      });
      if (!response.ok) {
        throw new Error('Error al eliminar el empleado');
      }

      fetchEmployees(); 
      onClose(); 
    } catch (error) {
      console.error('Error eliminando empleado:', error);
    }
  };

  const handleActivate = async (id) => {
    try {
      const response = await fetch(`http://chefhub.codefy.com:8080/api/activateemployee`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_usuario : id }) // Enviar el ID en JSON

      });
      console.log(response);
      if (!response.ok) {
        throw new Error('Error al activar el empleado');
      }

      fetchRemovedEmployees(); 
      onClose(); 
    } catch (error) {
      console.error('Error al activar empleado:', error);
    }
  };

  const filteredData = data.filter((item) =>
    Object.values(item).join(' ').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredRemovedData = dataremoved.filter((item) =>
    Object.values(item).join(' ').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalRemovedPages = Math.ceil(filteredRemovedData.length / itemsPerPage);
  const currentDataRemoved = filteredRemovedData.slice((currentRemovePage - 1) * itemsPerPage, currentRemovePage * itemsPerPage);

  return (
    <div>
      <div className='admin-format'>
        <div className='admin-title'><h2>EMPLEADOS</h2></div>
        <div className='admin-options'>
            <AddEmployeeModal onEmployeeAdded={handleEmployeeAdded} />
          <input
            type='text'
            placeholder='Buscar empleados...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='search-bar'
          />
        </div>

        <div className='admin-table'>
          <table>
            <thead>
              <tr>
                {currentData.length > 0 && Object.keys(currentData[0]).map((key) => <th key={key}>{key}</th>)}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id_usuario}>
                  {Object.entries(item).map(([key, value], idx) => (
                    <td key={idx}>
                      {key === 'Foto' ? (
                        <img
                          src={value}
                          alt={`Foto de ${item.name || 'empleado'}`}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      ) : (
                        value
                      )}
                    </td>
                  ))}
                  <td>
                    <EditEmployeeModal onEmployeeUpdated={handleEmployeeUpdated} selectedEmployee={item}></EditEmployeeModal>
                  <button
  className='admin-btn'
  onClick={() => { 
    setSelectedEmployee(item); 
    onOpen(); 
  }}
>
  <ClearIcon />
</button>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length > itemsPerPage && (
          <div className='pagination'>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className='admin-btn'
            >
              Anterior
            </button>
            <span>{currentPage} de {totalPages}</span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='admin-btn'
            >
              Siguiente
            </button>
          </div>
        )}
        <div className='admin-title'><h2>EMPLEADOS DE BAJA</h2></div>
        <div className='admin-table'>
          <table>
            <thead>
              <tr>
                {currentDataRemoved.length > 0 && Object.keys(currentDataRemoved[0]).map((key) => <th key={key}>{key}</th>)}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentDataRemoved.map((item) => (
                <tr key={item.id_usuario}>
                  {Object.entries(item).map(([key, value], idx) => (
                    <td key={idx}>
                      {key === 'Foto' ? (
                        <img
                          src={value}
                          alt={`Foto de ${item.name || 'empleado'}`}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      ) : (
                        value
                      )}
                    </td>
                  ))}
                  <td>
                    <button className='admin-btn' onClick={() => handleActivate(item.id_usuario)}><UserCheckIcon /></button>
                    

                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRemovedData.length > itemsPerPage && (
          <div className='pagination'>
            <button
              onClick={() => setCurrentRemovePage(currentRemovePage - 1)}
              disabled={currentRemovePage === 1}
              className='admin-btn'
            >
              Anterior
            </button>
            <span>{currentRemovePage} de {totalRemovedPages}</span>
            <button
              onClick={() => setCurrentRemovePage(currentRemovePage + 1)}
              disabled={currentRemovePage === totalRemovedPages}
              className='admin-btn'
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal de confirmación para eliminar empleado */}
      <Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>¿Eliminar empleado?</ModalHeader>
    <ModalBody>
      <p>¿Estás seguro de que deseas eliminar a {selectedEmployee?.Nombre}?</p>
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="red" onClick={() => handleDelete(selectedEmployee?.id_usuario)}>
        Eliminar
      </Button>
      <Button variant="ghost" onClick={onClose}>
        Cancelar
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

    </div>
  );
};

export default AdminEmployees;