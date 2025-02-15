import React, { useEffect, useState } from 'react';
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

const EditCategoryModal = ({selectedCategory, onCategoryUpdated }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const setPrevData = () => {
      setName(selectedCategory.nombre);
      setDescription(selectedCategory.descripcion);
    };
    setPrevData();
  }, [selectedCategory]);


  const resetForm = () => {
    setImage(null);
    setPreview(null);
    setName('');
    setDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !description) {
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
  
    const formData = new FormData();
    formData.append('id_categoria', selectedCategory.id_categoria);
    formData.append('nombre', name);
    formData.append('descripcion', description);
    formData.append('imagen', 'null');
  
    // 🔍 Verifica el contenido de formData antes de enviarlo
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    try {
      const response = await fetch("http://chefhub.codefy.com:8080/api/updatecategorie", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_categoria: selectedCategory.id_categoria,
          nombre: name, 
          descripcion: description, 
          imagen: image ,
        }),
      });
      
      const result = await response.json();
      console.log(result);
      toast({
        title: 'Éxito',
        description: `Categoría modificada correctamente`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
  
      onCategoryUpdated();
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Error al modificar la categoría',
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
          <ModalHeader>Editar Categoría</ModalHeader>
          <ModalBody>
            <div>
              <label>Nombre *</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
            </div>
            <div>
              <label>Descripción *</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" rows={3} />
            </div>
            <div>
              <label>Imagen *</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {preview && <img src={preview} alt="Vista previa" style={{ marginTop: '10px', maxWidth: '100%' }} />}
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

export default EditCategoryModal;
