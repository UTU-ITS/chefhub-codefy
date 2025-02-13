import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './AdminOptions.css';
import AdminProducts from './Products/AdminProducts';
import AdminEmpolyees from './Users/Empolyees/AdminEmpolyees';
import AdminCustomers from './Users/Customers/AdminCustomers';
import AdminTables from './Tables/AdminTables';
import Dashboard from './Dashboard/Dashboard';
import AdminOrders from './Orders/AdminOrders';
import AdminReservations from './Reservations/AdminReservations';
import AdminReports from './Reports/AdminReports';
import AdminCategory from './Category/AdminCategory';
import AdminIngredient from './Ingredient/AdminIngredient';
import AdminPreferences from './Preferences/AdminPreferences';
import AdminPersonalization from './Personalization/AdminsPersonalization';

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
                                >
                                    Panel de Información
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/products"
                                    onClick={() => handleOptionClick('Productos')}
                                >
                                    Productos
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/admin/category"
                                    onClick={() => handleOptionClick('Categorias')}
                                >
                                    Categorias
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/ingredient"
                                    onClick={() => handleOptionClick('Ingrediente')}
                                >
                                    Ingrediente
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/orders"
                                    onClick={() => handleOptionClick('Orders')}
                                >
                                    Pedidos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/reservations"
                                    onClick={() => handleOptionClick('reservations')}
                                >
                                    Reservas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/tables"
                                    onClick={() => handleOptionClick('Tables')}
                                >
                                    Mesas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/employees"
                                    onClick={() => handleOptionClick('Funcionarios')}
                                >
                                    Empleados
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/customers"
                                    onClick={() => handleOptionClick('Customers')}
                                >
                                    Clientes
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/reports"
                                    onClick={() => handleOptionClick('Reports')}
                                >
                                    Informes
                                </Link>
                            </li>
                            <div className="line-separator"></div>
                            <h3 className="options-title">CONFIGURACIÓN DEL PORTAL</h3>
                            <li>
                                <Link
                                    to="/admin/personalization"
                                    onClick={() => handleOptionClick('Personalización del portal')}
                                >
                                    Personalización
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/schedules"
                                    onClick={() => handleOptionClick('Horarios')}
                                >
                                    Horarios
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

            <div className="content">
                    <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="personalization" element={<AdminPersonalization/>} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="employees" element={<AdminEmpolyees />} />
                        <Route path="customers" element={<AdminCustomers />} />
                        <Route path="tables" element={<AdminTables />} />
                        <Route path="reservations" element={<AdminReservations />} />
                        <Route path="orders" element={<AdminOrders/>} />
                        <Route path="reports" element={<AdminReports />} />
                        <Route path="category" element={<AdminCategory />} />
                        <Route path="ingredient" element={<AdminIngredient />} />
                        <Route path="schedules" element={<AdminPreferences />} />
                    </Routes>
            </div>
        </div>
    );
}
