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
  Textarea,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { NewIcon } from '../../../img/HeroIcons';

const AddIngredientModal = ({ onIngredientAdded }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

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
      const response = await fetch("http://chefhub.codefy.com:8080/api/insertingredient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          precio: price,
        }),
      });
      
      const result = await response.json();
      toast({
        title: 'Éxito',
        description: `Ingrediente agregado correctamente`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
  
      onIngredientAdded();
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Error al agregar el ingrediente',
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
        <NewIcon /> Nuevo Ingrediente
      </button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nuevo Ingrediente</ModalHeader>
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

export default AddIngredientModal;
