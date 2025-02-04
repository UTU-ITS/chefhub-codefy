import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/cart.jsx';
import './CartSummary.css';
import { CloseIcon2 } from '../../img/HeroIcons';
import Ingredients from './Ingredients';

export default function CartSummary() {
  const { cartItems, addToCart, removeFromCartByUniqueId, updateNoteInCart } = useContext(CartContext);
  
  const handleNoteChange = (uniqueId, note) => {
    updateNoteInCart(uniqueId, note);
  };

  const handleAddItem = (item) => {
    const { uniqueId, ...itemWithoutUniqueId } = item;
    addToCart(itemWithoutUniqueId);
  };

  return (
    <div className='cart-summary'>
      <h2 className='cart-summary__title'>Resumen del Carrito</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Tu carrito está vacío</p>
      ) : (
        <div className='cart-summary__items'>
          {cartItems.map((item) => (
            <div className='cart-summary__item' key={item.uniqueId}>
              <button 
                className="cart-summary__add-button"
                onClick={() => handleAddItem(item)}
              >
                +
              </button>
              <img className="cart-summary__img" src={item.image} alt={item.name} />
              <div className="cart-summary__item-info">
                <h3 className='item-s-name'>{item.name}</h3>
                <p className='item-s-description'>{item.description}</p>
                <Ingredients productId={item.id} uniqueId={item.uniqueId} />
                <p className='item-s-price'>${item.price.toFixed(2)}</p>
                <textarea
                  className="cart-summary__product-note"
                  placeholder="Agregar nota (opcional)"
                  value={item.note || ''}
                  onChange={(e) => handleNoteChange(item.uniqueId, e.target.value)}
                />
              </div>
              
              <button 
                className='cart-summary__btn-delete' 
                onClick={() => removeFromCartByUniqueId(item.uniqueId)}
              >
                <CloseIcon2 />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className='cart-summary__total'>
        <p>Total: $ 
          {cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
}