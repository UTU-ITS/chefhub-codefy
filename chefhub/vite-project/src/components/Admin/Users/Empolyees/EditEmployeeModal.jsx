import React, { useState,useEffect } from 'react';
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
import { EditIcon } from '../../../../img/HeroIcons';
import './AddEmployeeModal.css';

const EditEmployeeModal = ({selectedEmployee, onEmployeeUpdated}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newEmployee, setNewEmployee] = useState({
    email: '',
    clave: '',
    nombre: '',
    apellido: '',
    telefono: '',
    fecha_nacimiento: '',
    direccion: '',
    hora_entrada: '',
    hora_salida: '',
    cargo: '',
  });
    useEffect(() => {
      setNewEmployee({
        id_usuario: selectedEmployee.id_usuario,
        nombre: selectedEmployee.Nombre,
        apellido: selectedEmployee.Apellido,
        email: selectedEmployee.Email,
        telefono: selectedEmployee.Teléfono,
        direccion: selectedEmployee.Dirección,
        hora_entrada: selectedEmployee.Entrada,
        hora_salida: selectedEmployee.Salida,
        cargo: selectedEmployee.Cargo,
      });
    }, [selectedEmployee]);
 


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async () => {
    if (!newEmployee.email || !newEmployee.nombre || !newEmployee.apellido ) {
      toast({
        title: 'Error',
        description: 'Por favor, complete todos los campos obligatorios.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    try {
      const response = await fetch('http://localhost/api/updateemployee', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });
      console.log(newEmployee);
      if (!response.ok) {
        throw new Error('Error al agregar el empleado');
      }

      onEmployeeUpdated();
      onClose();
      setNewEmployee({
        email: '',
        clave: '',
        nombre: '',
        apellido: '',
        telefono: '',
        fecha_nacimiento: '',
        direccion: '',
        hora_entrada: '',
        hora_salida: '',
        cargo: '',
      });

      toast({
        title: 'Éxito',
        description: 'Empleado agregado correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

    } catch (error) {
      console.error('Error agregando empleado:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error al agregar el empleado',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <>
      <button className="admin-btn" onClick={onOpen}>
        <EditIcon /> 
      </button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent className="custom-modal-content">
          <ModalHeader className="custom-modal-header">Editar Empleado</ModalHeader>
          <ModalBody className="custom-modal-body" overflowY="auto" maxH="60vh">
            <div className="custom-form-columns">
              <div className="custom-form-left">
                <div className="custom-form-group">
                  <label>Nombre *</label>
                  <Input
                    name="nombre"
                    value={newEmployee.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                    className="custom-input"
                  />
                </div>
                <div className="custom-form-group">
                  <label>Apellido *</label>
                  <Input
                    name="apellido"
                    value={newEmployee.apellido}
                    onChange={handleInputChange}
                    placeholder="Apellido"
                    className="custom-input"
                  />
                </div>
                <div className="custom-form-group">
                  <label>Correo Electrónico *</label>
                  <Input
                    type="email"
                    name="email"
                    value={newEmployee.email}
                    onChange={handleInputChange}
                    placeholder="Correo Electrónico"
                    className="custom-input"
                  />
                </div>
                <div className="custom-form-group">
                  <label>Teléfono</label>
                  <Input
                    name="telefono"
                    value={newEmployee.telefono}
                    onChange={handleInputChange}
                    placeholder="Teléfono"
                    className="custom-input"
                  />
                </div>
              </div>
              <div className="custom-form-right">

                <div className="custom-form-group">
                  <label>Dirección</label>
                  <Input
                    name="direccion"
                    value={newEmployee.direccion}
                    onChange={handleInputChange}
                    placeholder="Dirección"
                    className="custom-input"
                  />
                </div>
                <div className="custom-form-group">
                  <label>Horario de Entrada</label>
                  <Input
                    type="time"
                    name="hora_entrada"
                    value={newEmployee.hora_entrada}
                    onChange={handleInputChange}
                    className="custom-input"
                  />
                </div>
                <div className="custom-form-group">
                  <label>Horario de Salida</label>
                  <Input
                    type="time"
                    name="hora_salida"
                    value={newEmployee.hora_salida}
                    onChange={handleInputChange}
                    className="custom-input"
                  />
                </div>
                <div className="custom-form-group">
                  <label>Cargo</label>
                  <select
                    name="cargo"
                    value={newEmployee.cargo}
                    onChange={handleInputChange}
                    className="custom-input"
                  >
                    <option value="Chef">Chef</option>
                    <option value="Mesero">Mesero</option>
                    <option value="Administrativo">Administrativo</option>
                  </select>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="custom-modal-footer">
            <Button className="custom-cancel-btn" onClick={onClose}>
              Cancelar
            </Button>
            <Button className="custom-submit-btn" onClick={handleSubmit}>
              Agregar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditEmployeeModal;