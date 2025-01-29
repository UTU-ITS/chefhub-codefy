import React, { useState } from 'react';
import './NavBar.css';
import { CartIcon, UserIcon, SearchIcon, AdminIcon } from '../../img/HeroIcons';
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
                <a className="nav-link" href="/register">Registrarme</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about">Sobre Nosotros</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contact">Contactanos</a>
              </li>
          </ul>
        </div>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-list">

          <li className="nav-item">
              <a className="nav-link right" href="/admin/dashboard">
                <AdminIcon />
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