import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/cart';
import './CartSummary.css'; 
import { CloseIcon2 } from '../../img/HeroIcons';
import ExtraIngredients from './ExtraIngredients';

export default function CartSummary() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);
  const [notes, setNotes] = useState({});

  const handleNoteChange = (id, note) => {
    setNotes(prevNotes => ({
      ...prevNotes,
      [id]: note
    }));
  };

  return (
    <div className='cart-summary'>
      <h2 className='cart-summary__title'>Resumen del Carrito</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Tu carrito está vacío</p>
      ) : (
        <div className='cart-summary__items'>
          {cartItems.map((item) => (
            <div className='cart-summary__item' key={item.id}>
              <img className="cart-summary__img" src={item.image} alt={item.name} />
              <div className="cart-summary__item-info">
                <h3 className='item-s-name'>{item.name}</h3>
                <p className='item-s-description'>{item.description}</p>
                <ExtraIngredients></ExtraIngredients>
                <div className='cart-summary__quantity'>
                  <button 
                    className="cart-summary__quantity-button quantity-down"
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    -
                  </button>
                  <input type="number" min="1" max="9" value={item.quantity} readOnly />
                  <button 
                    className="cart-summary__quantity-button quantity-up"
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </button>
                </div>
                <p className='item-s-price'>${item.price}</p>
                <textarea
                  className="cart-summary__product-note"
                  placeholder="Agregar nota (opcional)"
                  value={notes[item.id] || ''}
                  onChange={(e) => handleNoteChange(item.id, e.target.value)}
                />
              </div>
              
              <button 
                className='cart-summary__btn-delete' 
                onClick={() => removeFromCart(item.id)}
              >
                <CloseIcon2 />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className='cart-summary__total'>
        <p>Total: $
          {cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
