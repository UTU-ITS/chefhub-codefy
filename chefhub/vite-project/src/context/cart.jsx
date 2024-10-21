import React, { createContext, useState } from 'react';

export const CartContext = createContext();

// Proveedor del contexto para envolver tu aplicación
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Función para agregar un producto al carrito
  const addToCart = (product, quantity) => {
    const existingProductIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingProductIndex >= 0) {
      // Si el producto ya está en el carrito, actualiza la cantidad
      const updatedCart = cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      );

      setCartItems(updatedCart);
    } else {
      // Si es un nuevo producto, agrégalo al carrito
      setCartItems([...cartItems, { ...product, quantity }]);
    }
  };

  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
};

const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
};



  // Función para eliminar un producto del carrito
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
  };

  const totalFromCart = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalFromCart, decreaseQuantity, increaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
