import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { EditIcon } from '../../../img/HeroIcons';

const EditIngredientModal = ({ingrediente, onIngredientUpdated }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  useEffect(() => {
    const setPrevData = () => {
      setName(ingrediente.nombre);
      setPrice(ingrediente.precio);
    };
    setPrevData();
  }, [ingrediente]);


  const resetForm = () => {
    setName('');
    setPrice('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !price ) {
      toast({
        title: 'Error',
        description: 'Complete todos los campos obligatorios',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
      return;
    }
  
    try {
      const response = await fetch("http://localhost/api/updateingredient", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_ingrediente: ingrediente.id_ingrediente,
          nombre: name,
          precio: price,
        }),
      });
      
      const result = await response.json();
      toast({
        title: 'Éxito',
        description: `Ingrediente modificado correctamente`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
  
      onIngredientUpdated();
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Error al modificar el ingrediente',
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
        <EditIcon />
      </button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Ingrediente</ModalHeader>
          <ModalBody>
            <div>
              <label>Nombre *</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
            </div>
            <div>
              <label>Precio *</label>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Precio" />
            </div>
            
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit} colorScheme="blue" ml={3}>Guardar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditIngredientModal;
