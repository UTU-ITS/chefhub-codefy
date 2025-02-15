import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/cart.jsx';
import './CartSummary.css';
import { CloseIcon2 } from '../../img/HeroIcons';
import Ingredients from './Ingredients';

export default function CartSummary() {
  const { cartItems, addToCart, removeFromCartByUniqueId, updateNoteInCart } = useContext(CartContext);
  const [expandedItems, setExpandedItems] = useState({}); // Estado para manejar los productos expandidos

  const toggleDetails = (uniqueId) => {
    setExpandedItems(prevState => ({
      ...prevState,
      [uniqueId]: !prevState[uniqueId]
    }));
  };

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
              <img className="cart-summary__img" src={item.image} alt={item.name} />
              <div className="cart-summary__item-info">
                <h1 className='item-s-name'>{item.name}</h1>
                <p className='item-s-description'>{item.description}</p>

                {/* Botón para alternar detalles */}
                <button 
                  className="cart-summary__details-btn"
                  onClick={() => toggleDetails(item.uniqueId)}
                >
                  {expandedItems[item.uniqueId] ? 'Ocultar detalles' : 'Ver detalles'}
                </button>

                
                <div className='cart-summary__info_ingredients'>
                {expandedItems[item.uniqueId] && (
                  <Ingredients productId={item.id} uniqueId={item.uniqueId} />
                )}

                <textarea
                  className="cart-summary__product-note"
                  placeholder="Agregar nota (opcional)"
                  value={item.note || ''}
                  onChange={(e) => handleNoteChange(item.uniqueId, e.target.value)}
                />
                </div>

                <p className='item-s-price'>${item.price.toFixed(2)}</p>
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
