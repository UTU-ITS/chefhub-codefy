import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './AdminOptions.css';
import AdminProducts from './AdminProducts';
import { ChakraProvider } from '@chakra-ui/react';

export default function Options() {
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const isSelected = (option) => selectedOption === option ? 'selectedOption' : '';

    return (
        
        <div className='options-div'>
                <div className="sidebar">
                    <ul>
                        <li>
                            <Link 
                                to="/admin/personalizacion" 
                                onClick={() => handleOptionClick('Personalización del portal')} 
                                className={isSelected('Personalización del portal')}
                            >
                                Personalización del portal
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/products" 
                                onClick={() => handleOptionClick('Productos')} 
                                className={isSelected('Productos')}
                            >
                                Productos
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/employees" 
                                onClick={() => handleOptionClick('Funcionarios')} 
                                className={isSelected('Funcionarios')}
                            >
                                Funcionarios
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/customers" 
                                onClick={() => handleOptionClick('Clientes')} 
                                className={isSelected('Clientes')}
                            >
                                Clientes
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/preferencias" 
                                onClick={() => handleOptionClick('Preferencias')} 
                                className={isSelected('Preferencias')}
                            >
                                Preferencias
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/reservas" 
                                onClick={() => handleOptionClick('Reservas')} 
                                className={isSelected('Reservas')}
                            >
                                Reservas
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/pedidos" 
                                onClick={() => handleOptionClick('Pedidos')} 
                                className={isSelected('Pedidos')}
                            >
                                Pedidos
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/informes" 
                                onClick={() => handleOptionClick('Informes')} 
                                className={isSelected('Informes')}
                            >
                                Informes
                            </Link>
                        </li>
                    </ul>
            </div>

            <div className="content">
                <Routes>
                    <Route path="personalizacion" element={<h1>Personalización del portal</h1>} />
                    <Route path="products" element={<AdminProducts
                                                        fetchData={() => api.get('/items')}
                                                        addData={(newItem) => api.post('/items', newItem)}
                                                        updateData={(updatedItem) => api.put(`/items/${updatedItem.id}`, updatedItem)}
                                                        deleteData={(id) => api.delete(`/items/${id}`)}
                                                        />} />
                    <Route path="employees" element={<h1>Funcionarios</h1>} />
                    <Route path="customers" element={<h1>Clientes</h1>} />
                    <Route path="preferencias" element={<h1>Preferencias</h1>} />
                    <Route path="reservas" element={<h1>Reservas</h1>} />
                    <Route path="pedidos" element={<h1>Pedidos</h1>} />
                    <Route path="informes" element={<h1>Informes</h1>} />
                </Routes>
            </div>
        </div>
    );
}
