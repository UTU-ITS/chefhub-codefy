import './Cart.css';
import React, { useState, useContext } from 'react';
import { CartContext } from '../../context/cart'; // Importa el contexto sin el CartProvider
import { CartIcon, CloseIcon, ClearIcon, DoneIcon, CloseIcon2 } from '../../img/HeroIcons';

export default function Cart() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

    const { cartItems, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useContext(CartContext); // Obtén cartItems del contexto

    return (
        <div>
            <button onClick={toggleCart} className='btn-cart-toggle'>
                {isOpen ? <CloseIcon /> : <CartIcon />}
            </button>
        
            <div className={`cart ${isOpen ? 'open' : ''}`}>
                <div className='cart-title'>
                    <p>Carrito</p>
                </div>

                {cartItems.length === 0 ? (
                    <p>Tu carrito está vacío</p>
                ) : (
                    <div className='cart-items'>
                        {cartItems.map((item) => (
                            <div className='cart-item' key={item.id}>
                                <img className="cart-img" src={item.image} alt={item.nombre} />
                                <div className='cart-item-info'>
                                    <p>{item.nombre}</p>
                                    <div className="quantity">
                                        <input type="number" min="1" max="9" value={item.quantity} readOnly />
                                        <div className="quantity-controls">
                                            <button 
                                                className="quantity-button quantity-up"
                                                onClick={() => increaseQuantity(item.id)}
                                            >
                                                +
                                            </button>
                                            <button 
                                                className="quantity-button quantity-down"
                                                onClick={() => decreaseQuantity(item.id)}
                                            >
                                                -
                                            </button>
                                        </div>
                                    </div>
                                    <p>${item.price}</p>
                                    <button 
                                        className='btn-delete' 
                                        onClick={() => removeFromCart(item.id)} // Elimina el producto del carrito
                                    >
                                        <CloseIcon2 />
                                    </button>  
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className='cart-total'>
                    <p>Total: $
                        {cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                    </p>
                </div>

                {/* Botones de acción */}
                <div className='cart-buttons'>
                    <span className='btn'>
                         <a href="/checkout">Finalizar Compra</a>
                        <DoneIcon />
                    </span>
                    <button className='btn' onClick={clearCart}>
                        Vaciar Carrito
                        <ClearIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}