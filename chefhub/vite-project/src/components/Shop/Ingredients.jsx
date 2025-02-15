import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { CartContext } from '../../context/cart.jsx';
import './Ingredients.css';

const Ingredients = ({ productId, uniqueId }) => {
  const [ingredients, setIngredients] = useState([]);
  const { cartItems, addPrice, decreasePrice, updateIngredients } = useContext(CartContext);

  useEffect(() => {
    console.log('cartItems:', cartItems);
    // Buscar el producto en el contexto por uniqueId
    const cartItem = cartItems.find(item => item.uniqueId === uniqueId);

    if (cartItem && cartItem.ingredients && cartItem.ingredients.length > 0) {
      // Inicializa con ingredientes del contexto
      setIngredients(cartItem.ingredients);
    } else {
      // Si no hay ingredientes en el contexto, realiza la solicitud a la API
      const fetchIngredients = async () => {
        try {
          const response = await axios.get(`http://chefhub.codefy.com:8080/api/ingredients/perproduct/${productId}`);
          if (response.data) {
            const data = Array.isArray(response.data) ? response.data : [response.data];
            const initializedIngredients = data.map(ingredient => ({
              ...ingredient,
              cantidad: ingredient.cantidad || 0,
              baseCantidad: ingredient.cantidad || 0
            }));
            setIngredients(initializedIngredients);
          }
        } catch (error) {
          console.error('Error fetching ingredients:', error);
        }
      };
      fetchIngredients();
    }
  }, [productId, uniqueId, cartItems]);

  const handleQuantityChange = (index, newValue) => {
    const ingredient = ingredients[index];
    if (!ingredient) return;

    const newQuantity = Math.max(0, Number(newValue));

    // Reglas de validación
    if (!ingredient.extra && newQuantity !== ingredient.cantidad) return;
    if (ingredient.extra && newQuantity > 10) return;
    if (ingredient.extra && newQuantity < ingredient.baseCantidad) return;

    const oldQuantity = ingredient.cantidad;
    const quantityDiff = newQuantity - oldQuantity;
    const priceChange = quantityDiff * ingredient.precio;

    if (ingredient.extra && priceChange !== 0) {
      setIngredients(prevIngredients =>
        prevIngredients.map((item, i) =>
          i === index ? { ...item, cantidad: newQuantity } : item
        )
      );

      if (priceChange > 0) {
        addPrice(uniqueId, priceChange);
      } else {
        decreasePrice(uniqueId, Math.abs(priceChange));
      }

      // Actualizar ingredientes en el contexto
      updateIngredients(uniqueId, ingredients.map((item, i) =>
        i === index ? { ...item, cantidad: newQuantity } : item
      ));
    }
  };

  return (
    <div className='ingredients-column'>
      {ingredients.length > 0 ? (
        ingredients.map((ingredient, index) => (
          <div key={`${ingredient.id_ingrediente}-${productId}`} className='ingredient-item'>
            <span>{ingredient.nombre}</span>
            <button 
              onClick={() => handleQuantityChange(index, ingredient.cantidad + 1)}
              className='btn-ing'
              disabled={!ingredient.extra || ingredient.cantidad >= 10}
            >
              +
            </button>
            <input
              type="number"
              min="0"
              value={ingredient.cantidad}
              onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
              disabled={!ingredient.extra}
            />
            <button 
              onClick={() => handleQuantityChange(index, ingredient.cantidad - 1)}
              className='btn-ing'
              disabled={!ingredient.extra || ingredient.cantidad <= ingredient.baseCantidad}
            >
              -
            </button>
          </div>
        ))
      ) : (
        <p>No hay ingredientes disponibles.</p>
      )}
    </div>
  );
};

Ingredients.propTypes = {
  productId: PropTypes.number.isRequired,
  uniqueId: PropTypes.string.isRequired,
};

export default Ingredients;