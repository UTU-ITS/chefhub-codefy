import './Cart.css';
import React, { useState } from 'react';
import { CartIcon, CloseIcon, ClearIcon, DoneIcon, CloseIcon2 } from '../img/HeroIcons';

export default function Cart() {
    const [isOpen, setIsOpen] = useState(false);
    const [quantity, setQuantity] = useState(1); // State to track the quantity of the product

    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

    // Handle the increase in quantity
    const increaseQuantity = () => {
        if (quantity < 9) {
            setQuantity(quantity + 1);
        }
    };

    // Handle the decrease in quantity, ensuring it doesn't go below 1
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <div>
            <button onClick={toggleCart} className='btn-cart-toggle'>
                {isOpen ? <CloseIcon /> : <CartIcon />}
            </button>

            <div className={`cart ${isOpen ? 'open' : ''}`}>
                <div className='cart-title'>
                    <p>Carrito</p>
                </div>
                <div className='cart-items'>
                    <div className='cart-item'>
                        <img className="cart-img" src='https://via.placeholder.com/150' alt='Producto' />
                        <div className='cart-item-info'>
                            <p>nombre</p>
                                                               <div className="quantity">
                                       <input type="number" min="1" max="9" value={quantity} readOnly />
                                       <div className="quantity-controls">
                                           <button className= " quantity-button quantity-up" onClick={increaseQuantity}>+</button>
                                           <button className=" quantity-button quantity-down" onClick={decreaseQuantity}>-</button>
                                       </div>
                                    </div>
                            <p>precio</p>
                          
                          <button className='btn-delete'><CloseIcon2/></button>  
                        </div>
                          
                           
                        
                    </div>
                </div>
                <div className='cart-total'>
                    <p>Total</p>
                </div>
                <div className='cart-buttons'>
                    <button className='btn'><DoneIcon /></button>
                    <button className='btn'><ClearIcon /></button>
                </div>
            </div>
        </div>
    );
}