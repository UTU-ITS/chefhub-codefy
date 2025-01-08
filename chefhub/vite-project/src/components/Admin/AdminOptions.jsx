import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './AdminOptions.css';
import Logo from '../../assets/logo-violeta.png';
import { HomeIcon, MenuIcon, AboutIcon, ContactIcon } from '../../img/HeroIcons';
import AdminProducts from './Products/AdminProducts';
import AdminEmpolyees from './Users/Empolyees/AdminEmpolyees';
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
                    <div className='logo'>
                        <img alt="Chef Hub Logo" src={Logo} style={{ width: '90px' }} />
                    </div>
                    <div className='options-navbar'>
                    <ul>
                        <li>
                            <a href="/"><HomeIcon/>Inicio</a>
                        </li>
                        <li>
                            <a href="/menu"><MenuIcon/>Menú</a>
                        </li>
                        <li>
                            <a href="/about"><AboutIcon/>Sobre Nosotros</a>
                        </li>
                        <li>
                            <a href="/contact"><ContactIcon/>Contactanos</a>
                        </li>
                    </ul>
                    </div>
                    <div className='line-separator'></div>
                    <div className='options-admin'>
                        <h3 className='options-title'>ADMINISTRACIÓN</h3>
                        <ul>
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
                                    to="/admin/pedidos" 
                                    onClick={() => handleOptionClick('Pedidos')} 
                                    className={isSelected('Pedidos')}
                                >
                                    Pedidos
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
                                    onClick={() => handleOptionClick('Clientes')} 
                                    className={isSelected('Clientes')}
                                >
                                    Clientes
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
                            <h3 className='options-title'>CONFIGURACIÓN DEL PORTAL</h3>
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
                    <Route path="personalizacion" element={<h1>Personalización del portal</h1>} />
                    <Route path="products" element={<AdminProducts/>} />
                    <Route path="employees" element={<AdminEmpolyees/>} />
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
