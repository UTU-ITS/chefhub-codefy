import React, { useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AfterCheckout.css";
import { useToast } from "@chakra-ui/react";
import { CartContext } from "../../context/cart";

const AfterCheckout = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { order, clearCart, clearOrder } = useContext(CartContext);

  const hasSubmitted = useRef(false);

  const handleOrderSubmitToBD = async () => {
    if (hasSubmitted.current) return; 
    hasSubmitted.current = true; 
    console.log("handleOrderSubmitToBD called");
    try {
      const response = await fetch("http://chefhub.codefy.com:8080/api/insertorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
      console.log("order".order);
      const result = await response.json();
  
      if (result.success) {
        
        clearCart();
        clearOrder();
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

  useEffect(() => {
    handleOrderSubmitToBD();
  }, []);

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

export default AfterCheckout;