import React, { useState, useEffect } from "react";
import { ClearIcon, UserCheckIcon } from "../../../img/HeroIcons";
import { fetchData } from "../apiService";
import AddIngredientModal from "./AddIngredientModal";

import {
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";

const AdminIngredient = () => {
  const [data, setData] = useState([]);
  const [dataRemoved, setDataRemoved] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRemovePage, setCurrentRemovePage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const itemsPerPage = 6;
  const toast = useToast();

  useEffect(() => {
    fetchIngredients();
    fetchRemovedIngredients();
  }, []);

  const fetchIngredients = async () => {
    fetchData("http://localhost/api/ingredients", setData);
  };
  
  const fetchRemovedIngredients = async () => {
    fetchData("http://localhost/api/deletedingredient", setDataRemoved);
  };

  const confirmDelete = (ingredient) => {
    setSelectedIngredient(ingredient);
    setDeleteModalOpen(true);
  };

  const handleIngredientAdded = () => {
    fetchIngredients();
  };

  const handleDelete = async () => {
    if (!selectedIngredient) return;
    console.log(selectedIngredient);

    try {
      const response = await fetch("http://localhost/api/deleteingredient", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_ingrediente: selectedIngredient }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Ingrediente eliminado",
          description: "El ingrediente se ha eliminado con éxito",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchIngredients();
        fetchRemovedIngredients();
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

  const handleActivate = async (id) => {
    try {
      const response = await fetch("http://localhost/api/activateingredient", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_ingrediente: id }),
      });

      const result = await response.json();

      if (result.success) {
        fetchIngredients();
        fetchRemovedIngredients();
        toast({
          title: "Ingrediente Activado",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
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
  };

  const filteredData = data.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredRemovedData = (Array.isArray(dataRemoved) ? dataRemoved : []).filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const totalRemovePages = Math.ceil(filteredRemovedData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const currentRemovedData = filteredRemovedData.slice((currentRemovePage - 1) * itemsPerPage, currentRemovePage * itemsPerPage);

  return (
    <div>
      <div className="admin-format">
        <div className="admin-title">
          <h2>INGREDIENTES</h2>
        </div>

        <div className="admin-options">
          <AddIngredientModal onIngredientAdded={handleIngredientAdded} />
          <input
            type="text"
            placeholder="Buscar ingredientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
        </div>

        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Ingrediente</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id_ingredient}>
                  <td>{item.nombre}</td>
                  <td>{item.precio}</td>
                  <td>
                    <button className="admin-btn" onClick={() => confirmDelete(item.id_ingrediente)}>
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
              <Text>¿Estás seguro de que deseas eliminar este ingrediente?</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" onClick={handleDelete}>
                Eliminar
              </Button>
              <Button onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {filteredData.length > itemsPerPage && (
          <div className="pagination">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="admin-btn">
              Anterior
            </button>
            <span>
              {currentPage} de {totalPages}
            </span>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="admin-btn">
              Siguiente
            </button>
          </div>
        )}
      </div>

      <div className="admin-format">
        <div className="admin-title">
          <h2>INGREDIENTES ELIMINADOS</h2>
        </div>

        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Ingrediente</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRemovedData.map((item) => (
                <tr key={item.id_ingredient}>
                  <td>{item.nombre}</td>
                  <td>
                    <button className="admin-btn" onClick={() => handleActivate(item.id_ingrediente)}>
                      <UserCheckIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminIngredient;
