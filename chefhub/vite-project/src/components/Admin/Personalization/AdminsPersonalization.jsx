import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchData, putData } from '../apiService';

export default function AdminPersonalization() {
    // Estado inicial como string vacío (no array)
    const [ActualColor, setActualColor] = useState('');
    const [NewColor, setNewColor] = useState('');

    useEffect(() => {
        // Modifica la llamada para extraer el color de la respuesta
        fetchData(
            'http://localhost/api/personalization/color',
            (data) => setActualColor(data.color)  // Asegúrate de extraer data.color
        );
    }, []);

    const handleChangeColor = () => {
        // Modifica la llamada para enviar el nuevo color
        putData(
            'http://localhost/api/personalization/updatecolor',
            { color: NewColor }  // Asegúrate de enviar el color
        );
        setActualColor(NewColor);
    }

    return (
        <div className="admin-personalization">
            <label>Color Actual:</label>
            {/* Muestra el color en texto y como muestra de color */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div 
                    style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: ActualColor,
                        border: '1px solid #ccc'
                    }}
                />
            </div>
            
            <label>Cambiar color:</label>
            <input 
                type="color"
                onChange={(e) => setNewColor(e.target.value)}
            />

            <button onClick={handleChangeColor}> Cambiar Color</button>
        </div>
    );
}