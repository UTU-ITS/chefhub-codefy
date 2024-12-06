import React, { useState } from 'react';
import './NavBar.css';
import { CartIcon, UserIcon, SearchIcon } from '../../img/HeroIcons';
import Logo from '../../assets/logo.svg';
import Cart from '../Shop/Cart';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="custom-navbar">
      <div className="nav-container">

        <div>
          <a className="navbar-brand" href="/">
            <img alt="Chef Hub Logo" src={Logo} style={{ width: '40px' }} />
          </a>
        </div>

        <div>
        <ul className="nav-list">
              <li className="nav-item">
                <a className="nav-link" href="/">Inicio</a>
             </li>
              <li className="nav-item">
                <a className="nav-link" href="/menu">Menú</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about">Sobre Nosotros</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contact">Contactanos</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link" href="/admin" >
                  Administrar <span className="dropdown-arrow">▼</span>
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="/sub-opcion-1">Personalización del portal</a></li>
                  <li><a className="dropdown-item" href="/sub-opcion-2">Productos</a></li>
                  <li><a className="dropdown-item" href="/sub-opcion-3">Funcionarios</a></li>
                  <li><a className="dropdown-item" href="/sub-opcion-3">Clientes</a></li>
                  <li><a className="dropdown-item" href="/sub-opcion-3">Preferencias</a></li>
                  <li><a className="dropdown-item" href="/sub-opcion-3">Reservas</a></li>
                  <li><a className="dropdown-item" href="/sub-opcion-3">Pedidos</a></li>
                  <li><a className="dropdown-item" href="/sub-opcion-3">Informes</a></li>
                </ul>
              </li>
          </ul>
        </div>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-list">

          <li className="nav-item">
              <a className="nav-link right" href="">
                <SearchIcon />
              </a>
            </li>

          <li className="nav-item">
              <Cart />
            </li>

            <li className="nav-item">
              <a className="nav-link right" href="/login">
                <UserIcon />
              </a>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
};

export default NavBar;