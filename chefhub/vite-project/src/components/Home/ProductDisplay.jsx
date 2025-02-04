import React from "react";
import './ProductDisplay.css'

export default function ProductDisplay() {
    return (
    <>
        <div className="productDisplay">
            <div>
                <img src="https://ecook.mx/wp-content/uploads/2024/07/receta-de-hamburguesa.png" alt="Product" />
            </div>
            <div className="productInfo">
                <h3 className="productName">Product Name</h3>
                <p className="productPrice">Product Description</p>
                <p>Price</p>
            </div>
        </div>
        <div className="productDisplay">
            <div>
                <img src="https://www.hola.com/horizon/square/53f70e5eb0c4-portada-burger-five-t.jpg?im=Resize=(640),type=downsize" alt="Product" />
            </div>
            <div className="productInfo">
                <h3 className="productName">Product Name</h3>
                <p className="productPrice">Product Description</p>
                <p>Price</p>
            </div>
        </div>
    </>
    );
}