import { createContext } from 'react';

export const CartContext = createContext(products); // Crear el contexto

export const CartProvider = ({ children }) => {
    return (
        <CartContext.Provider value={{
        

        }}>
            {children}
        </CartContext.Provider>
    ); }