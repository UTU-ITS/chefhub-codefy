// src/components/cart/IngredientModal.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './IngredientsModal.css';

const IngredientModal = ({ isOpen, onClose, productId, onConfirm }) => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      if (!isOpen || !productId) return;
      
      try {
        const response = await axios.get(`http://192.168.0.10:8080/api/ingredients/perproduct/${productId}`);
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
  }, [isOpen, productId]);

  const handleQuantityChange = (index, newValue) => {
    const ingredient = ingredients[index];
    if (!ingredient) return;

    const newQuantity = Math.max(0, Number(newValue));
    
    if (!ingredient.extra && newQuantity !== ingredient.cantidad) return;
    if (ingredient.extra && newQuantity > 10) return;
    if (ingredient.extra && newQuantity < ingredient.baseCantidad) return;

    setIngredients(prevIngredients =>
      prevIngredients.map((item, i) =>
        i === index ? { ...item, cantidad: newQuantity } : item
      )
    );
  };

  const handleConfirm = () => {
    const extraPrice = ingredients.reduce((total, ing) => {
      if (ing.extra && ing.cantidad > ing.baseCantidad) {
        return total + ((ing.cantidad - ing.baseCantidad) * ing.precio);
      }
      return total;
    }, 0);

    onConfirm(ingredients, extraPrice);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-ingredients">
      <div className="modal-content-ingredients">
        <div className="modal-header-ingredients">
          <h2>Personalizar Ingredientes</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body-ingredients">
          <div className='ingredients-column'>
            {ingredients.map((ingredient, index) => (
              <div key={ingredient.id_ingrediente} className='ingredient-item'>
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
                {ingredient.extra && (
                  <span className="ingredient-price">
                    ${ingredient.precio} c/u extra
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer-ingredients">
          <button className="btn btn-confirm-ingredients" onClick={handleConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

IngredientModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  productId: PropTypes.number,
  onConfirm: PropTypes.func.isRequired,
};

export default IngredientModal;