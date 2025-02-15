import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AfterCheckout.css";

const AfterCheckoutInside = () => {
  const navigate = useNavigate();

 // Empty dependency array ensures this runs only once

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/menu");
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="after-checkout-container">
      <h2 className="checkout-title">Pago cancelado</h2>
      <p className="checkout-message">Porfavor intentelo nuevamente</p>
    </div>
  );
};

export default AfterCheckoutInside;