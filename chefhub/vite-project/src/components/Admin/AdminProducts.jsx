import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminProducts.css'; // Asegúrate de importar el CSS
import { ClearIcon, EditIcon } from '../../img/HeroIcons';

const AdminProducts = () => {
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [newItem, setNewItem] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(null); // Almacena el ID del checkbox seleccionado

  // Fetch data from API using axios
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost/api/products');
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Add new item using axios
  const addData = async (item) => {
    try {
      const response = await axios.post('http://localhost/api/products', item);
      setData([...data, response.data]);
      setNewItem({});
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  // Update item using axios
  const updateData = async (item) => {
    try {
      const response = await axios.put(`http://localhost/api/products/${item.id}`, item);
      const updatedData = [...data];
      updatedData[editIndex] = response.data;
      setData(updatedData);
      setEditIndex(-1);
      setNewItem({});
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  // Delete item using axios
  const deleteData = async (id) => {
    try {
      await axios.delete(`http://localhost/api/products/${id}`);
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
      if (selectedItemId === id) {
        setSelectedItemId(null); // Desmarca si el seleccionado se elimina
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
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
          <h2>Productos</h2>
        </div>

        <div className='admin-options'>
          <button className='option-btn' onClick={() => window.location.href = 'products/addproduct'}>Nuevo</button>
          <button className='option-btn' onClick={() => window.location.href = 'products/addproduct'}>Editar</button>
          <button className='option-btn' onClick={() => window.location.href = 'products/addproduct'}>Eliminar</button>
        </div>

        <div className='admin-table'>
        <table>
          <thead>
            <tr>
              <th>Select</th>
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
