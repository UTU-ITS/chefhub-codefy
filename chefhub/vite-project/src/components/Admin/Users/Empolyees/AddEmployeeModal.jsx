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
import { NewIcon } from '../../../../img/HeroIcons';
import './AddEmployeeModal.css';

const AddEmployeeModal = ({ onEmployeeAdded }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newEmployee, setNewEmployee] = useState({
    email: '',
    clave: '',
    nombre: '',
    apellido: '',
    telefono: '',
    ci: '',
    fecha_nacimiento: '',
    direccion: '',
    horario_entrada: '',
    horario_salida: '',
    cargo: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateSecurePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewEmployee((prev) => ({
      ...prev,
      clave: password,
    }));
  };

  const copyToClipboard = () => {
    if (newEmployee.clave) {
      navigator.clipboard.writeText(newEmployee.clave)
        .then(() => {
          toast({
            title: 'Éxito',
            description: 'Contraseña copiada al portapapeles',
            status: 'success',
            duration: 2000,
            isClosable: true
          });
        })
        .catch((error) => {
          console.error('Error al copiar la contraseña:', error);
          toast({
            title: 'Error',
            description: 'Error al copiar la contraseña',
            status: 'error',
            duration: 2000,
            isClosable: true
          });
        });
    } else {
      toast({
        title: 'Advertencia',
        description: 'No hay contraseña para copiar',
        status: 'warning',
        duration: 2000,
        isClosable: true
      });
    }
  };

  const handleSubmit = async () => {
    if (!newEmployee.email || !newEmployee.clave || !newEmployee.nombre || !newEmployee.apellido || !newEmployee.ci || !newEmployee.fecha_nacimiento) {
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
      const response = await fetch('http://chefhub.codefy.com:8080/api/addemployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el empleado');
      }

      onEmployeeAdded();
      onClose();
      setNewEmployee({
        email: '',
        clave: '',
        nombre: '',
        apellido: '',
        telefono: '',
        ci: '',
        fecha_nacimiento: '',
        direccion: '',
        horario_entrada: '',
        horario_salida: '',
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
        <NewIcon /> Nuevo
      </button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent className="custom-modal-content">
          <ModalHeader className="custom-modal-header">Agregar Nuevo Empleado</ModalHeader>
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
                  <label>Contraseña *</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Input
                      type="password"
                      name="clave"
                      value={newEmployee.clave}
                      onChange={handleInputChange}
                      placeholder="Contraseña"
                      className="custom-input"
                      disabled
                    />
                    <Button onClick={generateSecurePassword} className="custom-generate-btn">
                      Generar
                    </Button>
                    <Button onClick={copyToClipboard} className="custom-copy-btn">
                      <h1>copiar</h1>
                    </Button>
                  </div>
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
                  <label>Cédula de Identidad *</label>
                  <Input
                    name="ci"
                    value={newEmployee.ci}
                    onChange={handleInputChange}
                    placeholder="Cédula de Identidad"
                    className="custom-input"
                  />
                </div>
                <div className="custom-form-group">
                  <label>Fecha de Nacimiento *</label>
                  <Input
                    type="date"
                    name="fecha_nacimiento"
                    value={newEmployee.fecha_nacimiento}
                    onChange={handleInputChange}
                    className="custom-input"
                  />
                </div>
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
                    name="horario_entrada"
                    value={newEmployee.horario_entrada}
                    onChange={handleInputChange}
                    className="custom-input"
                  />
                </div>
                <div className="custom-form-group">
                  <label>Horario de Salida</label>
                  <Input
                    type="time"
                    name="horario_salida"
                    value={newEmployee.horario_salida}
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

export default AddEmployeeModal;