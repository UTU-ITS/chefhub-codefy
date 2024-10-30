import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import './ExtraIngredients.css';
import { useContext } from 'react';
import { CartContext } from '../../context/cart';


export default function ExtraIngredients() {




  return (

    <div className='extra-ing-container'>

          <div className='extra-ing__quantity'>
                  <button 
                    className="extra-ing__quantity-button quantity-down"
                    
                  >
                    -
                  </button>
                  <input type="number" min="1" max="9" value='item' readOnly />
                  <button 
                    className="extra-ing__quantity-button quantity-up"
                   
                  >
                    +
                  </button>
                </div>
                


    </div>
  )
}
