import React from 'react'
import './CategoryRow.css'
import ProductDisplay from './ProductDisplay';

export default function CategoryRow() { 
    return (
        <>
        <section className='sideScroll'>
                <h1>Sugerencias</h1>
            <div className='bloques'>
                <ProductDisplay />
                <ProductDisplay />
                <ProductDisplay />
                <ProductDisplay />
                <ProductDisplay />
                <ProductDisplay />
                <ProductDisplay />
                <ProductDisplay />
                <ProductDisplay />
                <ProductDisplay />
                <ProductDisplay />
                <ProductDisplay />
            </div>
        </section>
        </>
    )
}
