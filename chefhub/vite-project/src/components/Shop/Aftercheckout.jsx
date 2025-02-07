import React, { useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AfterCheckout.css";
import { useToast } from "@chakra-ui/react";
import { CartContext } from "../../context/cart";

const AfterCheckout = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { order, clearCart } = useContext(CartContext);

  const hasSubmitted = useRef(false);

  const handleOrderSubmitToBD = async () => {
    if (hasSubmitted.current) return; // Si ya se ejecutó, salir
    hasSubmitted.current = true; // Marcar como ejecutado
    console.log("handleOrderSubmitToBD called");
    try {
      const response = await fetch("http://localhost/api/insertorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
      console.log("order".order);
      const result = await response.json();
  
      if (result.success) {
        toast({
          title: "Pedido realizado",
          description: "Su pedido ha sido procesado con éxito",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        clearCart();
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
  }, []); // Empty dependency array ensures this runs only once

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