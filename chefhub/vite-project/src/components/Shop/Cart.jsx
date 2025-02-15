import './Cart.css';
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/cart';
import { CartIcon, CloseIcon, ClearIcon, DoneIcon, CloseIcon2 } from '../../img/HeroIcons';
import { UserContext } from '../../context/user';

export default function Cart() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const [showLoginMessage, setShowLoginMessage] = useState(false);
    const [showEmplyCartMessage, setShowEmplyCartMessage] = useState(false);
    const [showRestrictedMessage, setShowRestrictedMessage] = useState(false);
    
    const { cartItems, removeFromCartByUniqueId, clearCart } = useContext(CartContext);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    
    const toggleCart = () => setIsOpen(!isOpen);

    const handleClick = () => {
        setIsFading(true);
        setTimeout(() => {
            toggleCart();
            setIsFading(false);
        }, 300);
    };

    const handleCheckout = () => {
        if (!user) {
            setShowLoginMessage(true);
            setTimeout(() => {
                setShowLoginMessage(false);
                navigate('/login');
            }, 3000);
        } else if (cartItems.length === 0) {
            setShowEmplyCartMessage(true);
            setTimeout(() => {
                setShowEmplyCartMessage(false);
                navigate('/menu');
            }, 3000);
        } else if (user.data && ["Chef", "Administrativo"].includes(user.data.cargo)) {
            setShowRestrictedMessage(true);
            setTimeout(() => setShowRestrictedMessage(false), 3000);
        } else {
            navigate('/checkout');
            setIsOpen(false);
        }
    };

    return (
        <div>
            <a onClick={handleClick}>
                <CartIcon />
            </a>

            <div className={`cart ${isOpen ? 'open' : ''}`}>
                <div className='cart-title'>
                    <p>Carrito</p>
                    <button className='button-close' onClick={toggleCart}>X</button>
                </div>

                {showLoginMessage && <div className="login-message">Iniciar sesión para continuar</div>}
                {showEmplyCartMessage && <div className="login-message">Su carrito está vacío, agregue productos para finalizar la compra.</div>}
                {showRestrictedMessage && <div className="login-message">No tienes permiso para finalizar la compra.</div>}

                {cartItems.length === 0 ? (
                    <p className="cart-empty">Tu carrito está vacío</p>
                ) : (
                    <div className='cart-items'>
                        {cartItems.map((item, index) => (
                            <div className='cart-item' key={index}>
                                <img className="cart-img" src={item.image} alt={item.name} />
                                <div className='cart-item-info'>
                                    <div className="cart-item-info-top">
                                        <p>{item.name}</p>
                                        <h4>${item.price.toFixed(2)}</h4>
                                    </div>
                                    <div className="cart-item-info-bottom">
                                        <button 
                                            className='btn-delete' 
                                            onClick={() => removeFromCartByUniqueId(item.uniqueId)}
                                        >
                                            <CloseIcon2 />
                                        </button> 
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {cartItems.length > 0 && (
                    <div className='cart-total'>
                        <p>Total: ${cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}</p>
                    </div>
                )}

                <div className='cart-buttons'>
                    <button 
                        className='btn' 
                        onClick={handleCheckout}
                        disabled={user && user.data && ["Chef", "Mesero", "Administrativo"].includes(user.data.cargo)}
                    >
                        Finalizar Compra
                        <DoneIcon />
                    </button>
                    <button className='btn' onClick={clearCart}>
                        Vaciar Carrito
                        <ClearIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}
