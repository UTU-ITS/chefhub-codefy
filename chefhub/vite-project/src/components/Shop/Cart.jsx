// Cart.js

import './Cart.css';
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/cart';
import { CartIcon, CloseIcon, ClearIcon, DoneIcon, CloseIcon2 } from '../../img/HeroIcons';

export default function Cart() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const { cartItems, addToCart, removeFromCartByUniqueId, clearCart } = useContext(CartContext);
    const consolecart = () => { console.log(cartItems); };
    const toggleCart = () => setIsOpen(!isOpen);

    const handleClick = () => {
        setIsFading(true);
        setTimeout(() => {
            toggleCart();
            setIsFading(false);
        }, 300);
    };

    return (
        <div>
            <button onClick={handleClick} className="cssbuttons-io">
                <span className={isFading ? 'fade' : ''}>
                    {isOpen ? <CloseIcon /> : <CartIcon />}
                </span>
            </button>

            <div className={`cart ${isOpen ? 'open' : ''}`}>
                <div className='cart-title'>
                    <p>Carrito</p>
                </div>

                {cartItems.length === 0 ? (
                    <p>Tu carrito está vacío</p>
                ) : (
                    <div className='cart-items'>
                        {cartItems.map((item, index) => (
                            <div className='cart-item' key={index}>
                                <img className="cart-img" src={item.image} alt={item.name} />
                                <div className='cart-item-info'>
                                    <p>{item.name}</p>
                                    <p>${item.price.toFixed(2)}</p>
                                    <button 
                                        className='btn-delete' 
                                        onClick={() => removeFromCartByUniqueId(item.uniqueId)} // Use index here
                                    >
                                        <CloseIcon2 />
                                    </button>  
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className='cart-total'>
                    <p>Total: ${cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}</p>
                </div>

                <div className='cart-buttons'>
                    <span className='btn'>
                        <Link to="/checkout">Finalizar Compra</Link>
                        <DoneIcon />
                    </span>
                    <button className='btn' onClick={() => { clearCart(); consolecart(); }}>
                        Vaciar Carrito
                        <ClearIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}