import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import "./Dashboard.css";
import { PendingOrdersIcon, ReservationsIcon, TableIcon, SalesIcon } from "../../../img/HeroIcons";

const Dashboard = () => {
  const [pendingOrders, setPendingOrders] = useState(0);
  const [confirmedReservations, setConfirmedReservations] = useState(0);
  const items = ["PEDIDOS PENDIENTES", "RESERVAS CONFIRMADAS", "MESAS OCUPADAS", "TOTAL DE VENTAS"];
  
  const navigate = useNavigate(); // Usar useNavigate para la navegación

  // Función para obtener los datos de la API
  const fetchPendingOrders = async () => {
    try {
      const response = await fetch("http://localhost/api/orders/onlinequantity");
      const data = await response.json();
      setPendingOrders(data.Cantidad); // Actualiza el estado con la cantidad obtenida
    } catch (error) {
      console.error("Error al obtener los pedidos pendientes:", error);
    }
  };

  const fetchConfirmedReservations = async () => {
    try {
      const response = await fetch("http://localhost/api/cantreservation");
      const data = await response.json();
      setConfirmedReservations(data.Cantidad);
    } catch (error) {
      console.error("Error al obtener las reservas confirmadas:", error);
    }
  }

  // Hook para llamar a la función cuando el componente se monta
  useEffect(() => {
    fetchPendingOrders();
    fetchConfirmedReservations();
  }, []);

  // Función para redirigir a otra página
  const handleNavigation = (item) => {
    switch (item) {
      case "PEDIDOS PENDIENTES":
        navigate("../orders"); // Redirige a la página de pedidos pendientes
        break;
      case "RESERVAS CONFIRMADAS":
        navigate("../reservas"); // Redirige a la página de reservas confirmadas
        break;
      case "MESAS OCUPADAS":
        navigate("../tables"); // Redirige a la página de mesas ocupadas
        break;
      case "TOTAL DE VENTAS":
        navigate("/ventas"); // Redirige a la página de ventas
        break;
      default:
        break;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-top">
        {items.map((item, index) => (
          <div
            key={index}
            className="dashboard-item"
            onClick={() => handleNavigation(item)} // Añadir evento de clic
          >
            <h4>{item}</h4>
            <h2>
              {item === "PEDIDOS PENDIENTES" && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span>{pendingOrders}</span>
                  <PendingOrdersIcon />
                </div>
              )}
              {item === "RESERVAS CONFIRMADAS" && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span>{confirmedReservations}</span>
                  <ReservationsIcon />
                </div>
              )}
              {item === "MESAS OCUPADAS" && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span>0</span>
                  <TableIcon />
                </div>
              )}
              {item === "TOTAL DE VENTAS" && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span>0</span>
                  <SalesIcon />
                </div>
              )}
            </h2>
          </div>
        ))}
      </div>

      <div className="dashboard-middle">
        <div className="dashboard-middle-left">
          <h3>Productos más vendidos</h3>
          <div className="product-list">
            <ul>
              <li>Producto 1</li>
              <li>Producto 2</li>
              <li>Producto 3</li>
              <li>Producto 4</li>
              <li>Producto 5</li>
            </ul>
          </div>
        </div>
        <div className="dashboard-middle-right">
          <h3>Productos menos vendidos</h3>
          <div className="product-list">
            <ul>
              <li>Producto 1</li>
              <li>Producto 2</li>
              <li>Producto 3</li>
              <li>Producto 4</li>
              <li>Producto 5</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
