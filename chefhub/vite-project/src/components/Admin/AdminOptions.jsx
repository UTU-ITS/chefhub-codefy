import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './AdminOptions.css';
import AdminProducts from './Products/AdminProducts';
import AdminEmpolyees from './Users/Empolyees/AdminEmpolyees';
import AdminCustomers from './Users/Customers/AdminCustomers';
import AddProduct from './Products/AddProduct';
import AdminTables from './Tables/AdminTables';
import Dashboard from './Dashboard/Dashboard';

export default function Options() {
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const isSelected = (option) => (selectedOption === option ? 'selectedOption' : '');

    return (
        <div className="options-div">
                <div className="sidebar">
                    <div className="options-admin">
                        <h3 className="options-title">ADMINISTRACIÓN</h3>
                        <ul>
                            <li>
                                <Link
                                    to="/admin/dashboard"
                                    onClick={() => handleOptionClick('Dashboard')}
                                    className={isSelected('Dashboard')}
                                >
                                    Panel de Información
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
                                    to="/admin/orders"
                                    onClick={() => handleOptionClick('Orders')}
                                    className={isSelected('Orders')}
                                >
                                    Pedidos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/reservations"
                                    onClick={() => handleOptionClick('reservations')}
                                    className={isSelected('reservations')}
                                >
                                    Reservas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/tables"
                                    onClick={() => handleOptionClick('Tables')}
                                    className={isSelected('Tables')}
                                >
                                    Mesas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/employees"
                                    onClick={() => handleOptionClick('Funcionarios')}
                                    className={isSelected('Funcionarios')}
                                >
                                    Empleados
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/customers"
                                    onClick={() => handleOptionClick('Customers')}
                                    className={isSelected('Customers')}
                                >
                                    Clientes
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/reports"
                                    onClick={() => handleOptionClick('Reports')}
                                    className={isSelected('Reports')}
                                >
                                    Informes
                                </Link>
                            </li>
                            <div className="line-separator"></div>
                            <h3 className="options-title">CONFIGURACIÓN DEL PORTAL</h3>
                            <li>
                                <Link
                                    to="/admin/personalizacion"
                                    onClick={() => handleOptionClick('Personalización del portal')}
                                    className={isSelected('Personalización del portal')}
                                >
                                    Personalización
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
                        </ul>
                    </div>
                </div>

            <div className="content">
                    <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="personalizacion" element={<h1>Personalización del portal</h1>} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="products/addproduct" element={<AddProduct />} />
                        <Route path="employees" element={<AdminEmpolyees />} />
                        <Route path="customers" element={<AdminCustomers />} />
                        <Route path="preferencias" element={<h1>Preferencias</h1>} />
                        <Route path="tables" element={<AdminTables />} />
                        <Route path="reservas" element={<h1>Reservas</h1>} />
                        <Route path="orders" element={<h1>Pedidos</h1>} />
                        <Route path="informes" element={<h1>Informes</h1>} />
                    </Routes>
            </div>
        </div>
    );
}
