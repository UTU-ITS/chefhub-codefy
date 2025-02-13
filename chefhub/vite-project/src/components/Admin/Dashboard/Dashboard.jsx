import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import "./Dashboard.css";
import { PendingOrdersIcon, ReservationsIcon, TableIcon, SalesIcon } from "../../../img/HeroIcons";

const Dashboard = () => {
  const [pendingOrders, setPendingOrders] = useState(0);
  const [confirmedReservations, setConfirmedReservations] = useState(0);
  const [cantOrders, setCantOrders] = useState(0);
  const [bestProducts, setBestProducts] = useState([]);
  const [usedIngredients, setUsedIngredients] = useState([]);
  const items = ["PEDIDOS PENDIENTES", "RESERVAS CONFIRMADAS", "TOTAL DE VENTAS"];
  
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
      const response = await fetch("http://localhost/api/getfuturereservations");
      const data = await response.json();
      setConfirmedReservations(data[0].Cantidad);
    } catch (error) {
      console.error("Error al obtener las reservas confirmadas:", error);
    }
  }
  const fetchCantOrders = async () => {
    try {
      const response = await fetch("http://localhost/api/getcantorders");
      const data = await response.json();
      setCantOrders(data);
      console.log(data);
    } catch (error) {
      console.error("Error al obtener las reservas confirmadas:", error);
    }
  }
  const fetchBestProducts = async () => {
    try {
      const response = await fetch("http://localhost/api/getbestproducts");
      const data = await response.json();
      setBestProducts(data);
    } catch (error) {
      console.error("Error al obtener las reservas confirmadas:", error);
    }
  }
  const fetchMostUsedIngredients = async () => {
    try {
      const response = await fetch("http://localhost/api/mostusedingredients");
      const data = await response.json();
      setUsedIngredients(data);
      console.log(data);
    } catch (error) {
      console.error("Error al obtener las reservas confirmadas:", error);
    }
  }

  // Hook para llamar a la función cuando el componente se monta
  useEffect(() => {
    fetchPendingOrders();
    fetchConfirmedReservations();
    fetchCantOrders();
    fetchBestProducts();
    fetchMostUsedIngredients();
  }, []);

  // Función para redirigir a otra página
  const handleNavigation = (item) => {
    switch (item) {
      case "PEDIDOS PENDIENTES":
        navigate("../orders"); // Redirige a la página de pedidos pendientes
        break;
      case "RESERVAS CONFIRMADAS":
        navigate("../reservations"); // Redirige a la página de reservas confirmadas
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
              {item === "TOTAL DE VENTAS" && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span>{cantOrders.Cantidad}</span>
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
  <table className="product-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Producto</th>
        <th>Total Vendido</th>
      </tr>
    </thead>
    <tbody>
      {bestProducts.map((product, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{product.nombre}</td>
          <td>{product.total_vendido}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        <div className="dashboard-middle-right">
          <h3>Ingredientes mas usados</h3>
          <table className="product-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Ingrediente</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {usedIngredients.map((ing, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{ing.nombre}</td>
          <td>{ing.cantidad}</td>
        </tr>
      ))}
    </tbody>
  </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
