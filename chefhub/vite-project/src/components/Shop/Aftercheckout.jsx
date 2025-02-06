import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AfterCheckout.css";

const AfterCheckout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="after-checkout-container">
      <h2 className="checkout-title">Gracias por tu compra</h2>
      <p className="checkout-message">Serás redirigido a la página principal en unos segundos...</p>
    </div>
  );
};

export default AfterCheckout;