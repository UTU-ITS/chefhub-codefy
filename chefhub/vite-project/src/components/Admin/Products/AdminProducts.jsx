import React, { useState, useEffect } from 'react';
import { NewIcon, EditIcon, ClearIcon } from '../../../img/HeroIcons';
import { fetchData } from '../apiService';
import { useToast, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Text } from '@chakra-ui/react';

const AdminProducts = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const itemsPerPage = 12;
  const toast = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    fetchData('http://localhost/api/products', setData);
  };

  const confirmDelete = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
  
    try {
      const response = await fetch("http://localhost/api/deleteproduct", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_producto: selectedProduct.ID }), // Asegúrate de usar 'id_producto'
      });
  
      const result = await response.json();
  
      if (result.success) {
        toast({
          title: "Producto eliminado",
          description: "El producto se ha eliminado con éxito",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchProducts();
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
    Object.values(item).join(' ').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <div className='admin-format'>
        <div className='admin-title'>
          <h2>PRODUCTOS</h2>
        </div>

        <div className='admin-options'>
          <a className='admin-btn' href="products/addproduct">
            <NewIcon />Nuevo
          </a>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
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
                <tr key={item.id}>
                  {Object.entries(item).map(([key, value], idx) => (
                    <td key={idx}>
                      {key === "Imagen" ? (
                        <img src={value} alt={`Imagen de ${item.name || 'producto'}`} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                      ) : (
                        value
                      )}
                    </td>
                  ))}
                  <td>
                    <button className="admin-btn" onClick={() => handleEdit(item.id)}>
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

        <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmar eliminación</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>¿Estás seguro de que deseas eliminar este producto?</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" onClick={handleDelete}>Eliminar</Button>
              <Button onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {filteredData.length > itemsPerPage && (
          <div className='pagination'>
            <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1} className='admin-btn'>
              Anterior
            </button>
            <span>{currentPage} de {totalPages}</span>
            <button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages} className='admin-btn'>
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
