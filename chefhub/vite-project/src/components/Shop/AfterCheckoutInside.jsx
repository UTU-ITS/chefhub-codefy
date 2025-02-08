import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AfterCheckout.css";

const AfterCheckoutInside = () => {
  const navigate = useNavigate();

 // Empty dependency array ensures this runs only once

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/myprofile");
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="after-checkout-container">
      <h2 className="checkout-title">Gracias por su compra</h2>
      <p className="checkout-message">Puede verificar el estado de su pedido en</p> <strong> Mi perfil.</strong> <br /> <p>Será redirigido ahí en unos segundos.</p>
    </div>
  );
};

export default AfterCheckoutInside;