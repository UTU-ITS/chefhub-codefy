
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { NewIcon } from '../../../img/HeroIcons';
import './AddTableModal.css';

const AddTableModal = ({ onTableAdded }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tableData, setTableData] = useState({
    id_mesa: '',
    capacidad: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTableData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!tableData.id_mesa || !tableData.capacidad) {
      toast({
        title: 'Error',
        description: 'Todos los campos son obligatorios',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
      return;
    }

    try {
      const response = await fetch('http://chefhub.codefy.com:8080/api/inserttable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tableData)
      });

      if (!response.ok) throw new Error('Error al crear la mesa');

      toast({
        title: 'Éxito',
        description: 'Mesa creada correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });

      onTableAdded();
      onClose();
      setTableData({ id_mesa: '', capacidad: '' });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Error al guardar la mesa',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    }
  };

  return (
    <>
      <button className="admin-btn" onClick={onOpen}>
        <NewIcon /> Nuevo
      </button>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent className="addtable-modal">
          <ModalHeader className="addtable-header">Agregar Nueva Mesa</ModalHeader>
          <ModalBody className="addtable-body">
            <div className="addtable-form">
              <div className="addtable-field">
                <label>Nº de Mesa *</label>
                <Input
                  name="id_mesa"
                  value={tableData.id_mesa}
                  onChange={handleInputChange}
                  placeholder="Ej: 1"
                />
              </div>
              
              <div className="addtable-field">
                <label>Capacidad *</label>
                <Input
                  type="number"
                  name="capacidad"
                  value={tableData.capacidad}
                  onChange={handleInputChange}
                  placeholder="Nº de personas"
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="addtable-footer">
            <Button className="addtable-cancel-btn" onClick={onClose}>
              Cancelar
            </Button>
            <Button className="addtable-submit-btn" onClick={handleSubmit}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddTableModal;