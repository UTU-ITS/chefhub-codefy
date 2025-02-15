import React, { useState, useEffect } from "react";
import { NewIcon, EditIcon, ClearIcon, UserCheckIcon } from "../../../img/HeroIcons";
import { fetchData } from "../apiService";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";

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

const AdminProducts = () => {
  const [data, setData] = useState([]);
  const [dataremoved, setDataRemoved] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRemovePage, setCurrentRemovePage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const itemsPerPage = 6;
  const toast = useToast();

  useEffect(() => {
    fetchProducts();
    fetchRemovedProducts();
  }, []);

  const fetchProducts = async () => {
    fetchData("http://192.168.0.10:8080/api/products", setData);
  };
  const fetchRemovedProducts = async () => {
    fetchData("http://192.168.0.10:8080/api/getremovedproducts", setDataRemoved);
  };

  const confirmDelete = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleProductAdded = () => {
    fetchProducts();
  };
  const handleProductUpdated = () => {
    fetchProducts();
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch("http://192.168.0.10:8080/api/deleteproduct", {
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
    fetchProducts();
    fetchRemovedProducts();
    setDeleteModalOpen(false);
  };

  const handleActivate= async (id) => {
 

    try {
      const response = await fetch("http://192.168.0.10:8080/api/activateproduct", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_producto: id }), // Asegúrate de usar 'id_producto'
      });

      const result = await response.json();

      if (result.success) {
        fetchProducts();
        fetchRemovedProducts();
        toast({
          title: "Producto Activado",
          description: "",
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
  const filteredRemovedData = dataremoved.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const totalRemovePages = Math.ceil(filteredRemovedData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const currentRemovedData = filteredRemovedData.slice((currentRemovePage - 1) * itemsPerPage, currentRemovePage * itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handleRemovePageChange = (direction) => {
    if (direction === "prev" && currentRemovePage > 1) {
      setCurrentRemovePage(currentRemovePage - 1);
    } else if (direction === "next" && currentRemovePage < totalRemovePages) {
      setCurrentRemovePage(currentRemovePage + 1);
    }
  };

  return (
    <div>
      <div className="admin-format">
        <div className="admin-title">
          <h2>PRODUCTOS</h2>
        </div>

        <div className="admin-options">
          <AddProductModal onProductAdded={handleProductAdded }/>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
        </div>

        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                {currentData.length > 0 &&
                  Object.keys(currentData[0])
                    .filter((key) => key !== "ID" && key !== "Imagen" && key !== "Producto") // Ocultar ID e Imagen
                    .map((key) => <th key={key}>{key}</th>)}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.ID}>
                  {/* Primera columna con imagen + nombre */}
                  <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                      src={`http://192.168.0.10:8080/${item.Imagen}`}
                      alt={`Imagen de ${item.Producto}`}
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                    />
                    <span>{item.Producto}</span>
                  </td>

                  {/* Resto de las columnas (sin ID ni Imagen) */}
                  {Object.entries(item)
                    .filter(([key]) => key !== "ID" && key !== "Imagen" && key !== "Producto")
                    .map(([key, value], idx) => (
                      <td key={idx}>{value}</td>
                    ))}

                  {/* Acciones */}
                  <td>
                    <EditProductModal onProductUpdated={handleProductUpdated} product={item} ></EditProductModal>
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
              <Button colorScheme="red" onClick={handleDelete}>
                Eliminar
              </Button>
              <Button onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {filteredData.length > itemsPerPage && (
          <div className="pagination">
            <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1} className="admin-btn">
              Anterior
            </button>
            <span>
              {currentPage} de {totalPages}
            </span>
            <button onClick={() => handlePageChange("next")} disabled={currentPage === totalPages} className="admin-btn">
              Siguiente
            </button>
          </div>
        )}
      </div>
      <div>
      <div className="admin-format">
        <div className="admin-title">
          <h2>PRODUCTOS DE BAJA</h2>
        </div>
        
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                {currentRemovedData.length > 0 &&
                  Object.keys(currentRemovedData[0])
                    .filter((key) => key !== "ID" && key !== "Imagen" && key !== "Producto") // Ocultar ID e Imagen
                    .map((key) => <th key={key}>{key}</th>)}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRemovedData.map((item) => (
                <tr key={item.ID}>
                  <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                      src={`http://192.168.0.10:8080/${item.Imagen}`}
                      alt={`Imagen de ${item.Producto}`}
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                    />
                    <span>{item.Producto}</span>
                  </td>

                  {Object.entries(item)
                    .filter(([key]) => key !== "ID" && key !== "Imagen" && key !== "Producto")
                    .map(([key, value], idx) => (
                      <td key={idx}>{value}</td>
                    ))}

                  <td>
                    <button className="admin-btn" onClick={() => handleActivate(item.ID)}>
                    <UserCheckIcon></UserCheckIcon>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {filteredRemovedData.length > itemsPerPage && (
          <div className="pagination">
            <button onClick={() => handleRemovePageChange("prev")} disabled={currentRemovePage === 1} className="admin-btn">
              Anterior
            </button>
            <span>
              {currentRemovePage} de {totalRemovePages}
            </span>
            <button onClick={() => handleRemovePageChange("next")} disabled={currentRemovePage === totalRemovePages} className="admin-btn">
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
    
  );
};

export default AdminProducts;
