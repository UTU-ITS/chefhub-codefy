import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [order, setOrder] = useState(() => {
    const savedOrder = localStorage.getItem('order');
    return savedOrder ? JSON.parse(savedOrder) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  useEffect(() => {
    localStorage.setItem('order', JSON.stringify(order));
  }, [order]);
  const addOrder = (order) => {
    setOrder(order);
  };
  const addToCart = (product, selectedIngredients = []) => {
    const uniqueId = `${product.id}-${Date.now()}`;
  
    const filteredIngredients = selectedIngredients.filter(ing => 
      ing.extra === true || (ing.cantidad && ing.cantidad > ing.baseCantidad)
    );
  
    setCartItems(prevItems => [...prevItems, { 
      ...product, 
      uniqueId,
      ingredients: filteredIngredients.map(ing => ({
        ...ing,
        cantidad: ing.cantidad || ing.baseCantidad || 0
      }))
    }]);
  };

  const updateNoteInCart = (uniqueId, note) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.uniqueId === uniqueId ? { ...item, note } : item
      )
    );
  };

  const removeFromCartByUniqueId = (uniqueId) => {
    setCartItems(prevItems => prevItems.filter(item => item.uniqueId !== uniqueId));
  };

  const updateIngredients = (uniqueId, ingredients) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.uniqueId === uniqueId
          ? { ...item, ingredients }
          : item
      )
    );
  };

  const addPrice = (uniqueId, priceToAdd) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.uniqueId === uniqueId
          ? { ...item, price: Number((item.price + priceToAdd).toFixed(2)) }
          : item
      )
    );
  };

  const decreasePrice = (uniqueId, priceToDecrease) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.uniqueId === uniqueId
          ? { ...item, price: Number((item.price - priceToDecrease).toFixed(2)) }
          : item
      )
    );
  };
 const clearOrder= () => setCartItems([]);
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        order,
        addOrder,
        clearOrder,
        addToCart,
        addPrice,
        decreasePrice,
        removeFromCartByUniqueId,
        updateIngredients,
        clearCart,
        updateNoteInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};