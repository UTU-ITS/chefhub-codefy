import './Cart.css';
import { CartProvider } from '../../context/cart';
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/cart'; // Importa el contexto sin el CartProvider
import { CartIcon, CloseIcon, ClearIcon, DoneIcon, CloseIcon2 } from '../../img/HeroIcons';

export default function Cart() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

    const { cartItems, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useContext(CartContext); // Obtén cartItems del contexto
    const handleClick = () => {
        setIsFading(true); // Start fading out
        setTimeout(() => {
            toggleCart();   // Toggle the cart state
            setIsFading(false); // Fade back in
        }, 300); // Delay matches the fade-out duration
    };
  
    return (
        <div>
                 
    <button onClick={handleClick} className="cssbuttons-io">
        <span className={isFading ? 'fade' : ''}>
            {isOpen ? <CloseIcon /> : <CartIcon />}
            {isOpen ? 'Ocultar Carrito' : 'Ver Carrito'}
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
                        {cartItems.map((item) => (
                            <div className='cart-item' key={item.id}>
                                <img className="cart-img" src={item.image} alt={item.name} />
                                <div className='cart-item-info'>
                                    <p>{item.name}</p>
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

         
                <div className='cart-buttons'>
                    <span className='btn'>
                    <Link to="/checkout">Finalizar Compra</Link>
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