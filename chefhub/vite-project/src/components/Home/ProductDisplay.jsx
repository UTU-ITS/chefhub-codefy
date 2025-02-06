import React from "react";
import './ProductDisplay.css'

export default function ProductDisplay() {
    return (
    <>
        <div className="productDisplay">
            <div className="productImage">
                <img src="https://ecook.mx/wp-content/uploads/2024/07/receta-de-hamburguesa.png" alt="Product" />
            </div>
            <div className="productInfo">
                <h3 className="productName">Pizzetas con muzza</h3>
                <p className="productDescription">Masa de pizza con una excelente salsa italiana y muzzarella conaprole.</p>
                <p className="productPrice">$470</p>
            </div>
        </div>
        
    </>
    );
}