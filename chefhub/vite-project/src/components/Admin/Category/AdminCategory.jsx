import React, { useState, useEffect } from "react";
import { ClearIcon, UserCheckIcon } from "../../../img/HeroIcons";
import { fetchData } from "../apiService";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

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

const AdminCategory = () => {
  const [data, setData] = useState([]);
  const [dataRemoved, setDataRemoved] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRemovePage, setCurrentRemovePage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategorie, setSelectedCategorie] = useState(null);
  const itemsPerPage = 6;
  const toast = useToast();

  useEffect(() => {
    fetchCategories();
    fetchRemovedCategories();
  }, []);

  const fetchCategories = async () => {
    fetchData("http://localhost/api/categories", setData);
  };
  
  const fetchRemovedCategories = async () => {
    fetchData("http://localhost/api/getremovedcategories", setDataRemoved);
  };

  const confirmDelete = (categorie) => {
    setSelectedCategorie(categorie);
    setDeleteModalOpen(true);
  };

  const handleCategorieAdded = () => {
    fetchCategories();
  };

  const handleDelete = async () => {
    if (!selectedCategorie) return;

    try {
      const response = await fetch("http://localhost/api/deletecategorie", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_categoria: selectedCategorie}),
      });
      console.log(response);
      const result = await response.json();

      if (result.success) {
        toast({
          title: "Categoría eliminada",
          description: "La categoría se ha eliminado con éxito",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchCategories();
        fetchRemovedCategories();
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
      const response = await fetch("http://localhost/api/activatecategorie", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_categoria: id }),
      });

      const result = await response.json();

      if (result.success) {
        fetchCategories();
        fetchRemovedCategories();
        toast({
          title: "Categoría Activada",
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
  const filteredRemovedData = dataRemoved.filter((item) =>
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
          <h2>CATEGORÍAS</h2>
        </div>

        <div className="admin-options">
          <AddCategoryModal onCategorieAdded={handleCategorieAdded} />
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
        </div>

        <div className="admin-table">
          <table>
            <thead>
              <tr>

                {currentData.length > 0 &&
                  Object.keys(currentData[0])
                    .filter((key) => key !== "ID")
                    .map((key) => <th key={key}>{key}</th>)}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id_categoria}>


                  {Object.entries(item)
                    .filter(([key]) => key !== "ID" && key !== "Nombre")
                    .map(([key, value], idx) => (
                      <td key={idx}>{value}</td>
                    ))}

                  <td>
                    <button className="admin-btn" onClick={() => confirmDelete(item.id_categoria)}>
                      <ClearIcon />
                    </button>
                    <EditCategoryModal selectedCategory={item}  onCategoryUpdated={fetchCategories} categorie={item} />
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
              <Text>¿Estás seguro de que deseas eliminar esta categoría?</Text>
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
          <h2>CATEGORÍAS ELIMINADAS</h2>
        </div>

        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRemovedData.map((item) => (
                <tr key={item.id_categoria}>
                  <td>{item.nombre}</td>
                  <td>
                    <button className="admin-btn" onClick={() => handleActivate(item.id_categoria)}>
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

export default AdminCategory;
