import React, { useState, useEffect } from 'react';
import './AdminProducts.css';
import { NewIcon, EditIcon, ClearIcon } from '../../../img/HeroIcons';
import { fetchData } from '../apiService';

const AdminProducts = () => {
  const [data, setData] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null); // Almacena el ID del checkbox seleccionado

  useEffect(() => {
    fetchData('http://localhost/api/products', setData);
}, []);

  // Lógica para seleccionar solo un checkbox a la vez
  const toggleSelectItem = (id) => {
    // Si el item ya está seleccionado, lo deselecciona. Si no, selecciona el nuevo.
    setSelectedItemId(selectedItemId === id ? null : id);
  };

  return (
    <div>
      <div className='admin-format'>

        <div className='admin-title'>
          <h2>PRODUCTOS</h2>
        </div>

        <div className='admin-options'>
          <a className='option-btn' href="products/addproduct"><NewIcon/>Nuevo</a>
          <a className='option-btn' href = "products/addproduct"><EditIcon/>Editar</a>
          <a className='option-btn' href = "products/addproduct"><ClearIcon/>Eliminar</a>
        </div>

        <div className='admin-table'>
        <table>
          <thead>
            <tr>
              <th></th>
              {data.length > 0 &&
                Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    className='prueba'
                    type="checkbox"
                    checked={selectedItemId === item.id}
                    onChange={() => toggleSelectItem(item.id)}
                  />
                </td>
                {Object.entries(item).map(([key, value], idx) => (
                  <td key={idx}>
                    {key === "Imagen" ? (
                      <img
                        src={value}
                        alt={`Imagen de ${item.name || 'producto'}`}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    ) : (
                      value
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
