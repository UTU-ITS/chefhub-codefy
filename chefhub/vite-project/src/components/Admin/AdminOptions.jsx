import React, { useState, useContext, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/user';
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
import NotFound from '../../App';

export default function Options() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        if (!user || !user.data) {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user || !user.data) {
        return null;
    }

    if (!user.data.cargo) {
        return <Routes><Route path="*" element={<NotFound />} /></Routes>;
    }

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
                            <Link to="/admin/dashboard" onClick={() => handleOptionClick('Dashboard')} className={isSelected('Dashboard')}>
                                Panel de Información
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/products" onClick={() => handleOptionClick('Productos')} className={isSelected('Productos')}>
                                Productos
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/category" onClick={() => handleOptionClick('Categorias')} className={isSelected('Categorias')}>
                                Categorias
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/ingredient" onClick={() => handleOptionClick('Ingrediente')} className={isSelected('Ingrediente')}>
                                Ingrediente
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/orders" onClick={() => handleOptionClick('Orders')} className={isSelected('Orders')}>
                                Pedidos
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/reservations" onClick={() => handleOptionClick('reservations')} className={isSelected('reservations')}>
                                Reservas
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/tables" onClick={() => handleOptionClick('Tables')} className={isSelected('Tables')}>
                                Mesas
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/employees" onClick={() => handleOptionClick('Funcionarios')} className={isSelected('Funcionarios')}>
                                Empleados
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/customers" onClick={() => handleOptionClick('Customers')} className={isSelected('Customers')}>
                                Clientes
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/reports" onClick={() => handleOptionClick('Reports')} className={isSelected('Reports')}>
                                Informes
                            </Link>
                        </li>
                        <div className="line-separator"></div>
                        <h3 className="options-title">CONFIGURACIÓN DEL PORTAL</h3>
                        <li>
                            <Link to="/admin/personalizacion" onClick={() => handleOptionClick('Personalización del portal')} className={isSelected('Personalización del portal')}>
                                Personalización
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/preferences" onClick={() => handleOptionClick('Preferencias')} className={isSelected('Preferencias')}>
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
                    <Route path="employees" element={<AdminEmpolyees />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="preferencias" element={<h1>Preferencias</h1>} />
                    <Route path="tables" element={<AdminTables />} />
                    <Route path="reservations" element={<AdminReservations />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="category" element={<AdminCategory />} />
                    <Route path="ingredient" element={<AdminIngredient />} />
                    <Route path="preferences" element={<AdminPreferences />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
}