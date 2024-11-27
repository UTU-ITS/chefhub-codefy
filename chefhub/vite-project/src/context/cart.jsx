import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, selectedIngredients = []) => {
    const uniqueId = `${product.id}-${Date.now()}`;
    setCartItems(prevItems => [...prevItems, { 
      ...product, 
      uniqueId,
      ingredients: selectedIngredients.map(ing => ({
        ...ing,
        cantidad: ing.cantidad || ing.baseCantidad || 0
      }))
    }]);
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

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        addPrice,
        decreasePrice,
        removeFromCartByUniqueId,
        updateIngredients,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
