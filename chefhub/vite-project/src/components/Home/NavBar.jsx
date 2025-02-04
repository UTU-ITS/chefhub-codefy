import React, { useState, useContext, useEffect } from 'react';
import './NavBar.css';
import { CartIcon, UserIcon, SearchIcon, AdminIcon, LogoutIcon } from '../../img/HeroIcons';
import Logo from '../../assets/logo.svg';
import Cart from '../Shop/Cart';
import { UserContext } from '../../context/user';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user,logout } = useContext(UserContext);

  // Debug: Verificar cambios en el usuario
  useEffect(() => {
  }, [user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="custom-navbar">
      <div className="nav-container">
        {/* Logo */}
        <div>
          <a className="navbar-brand" href="/">
            <img alt="Chef Hub Logo" src={Logo} style={{ width: '40px' }} />
          </a>
        </div>

        {/* Links principales */}
        <div>
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/">Inicio</a>
            </li>
            <li className="nav-item">
              <a href="/menu">Menú</a>
            </li>
            <li className="nav-item">
              <a href="/reservations">Reserva tu mesa</a>
            </li>
            {!user?.data && (
            <li className="nav-item">
              <a href="/register">Registrarme</a>
            </li>
             )}
            <li className="nav-item">
              <a href="/about">Sobre Nosotros</a>
            </li>
            <li className="nav-item">
              <a href="/contact">Contáctanos</a>
            </li>
          </ul>
        </div>

        {/* Menú derecho */}
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-list">
          {user && user.data && (user.data.cargo === "Chef" || user.data.cargo === "Mesero" || user.data.cargo === "Administrativo") && (
            <>
          <li className="nav-item">
              <a href="/admin/dashboard">
                <AdminIcon />
              </a>
            </li>
            </>)}
            <li className="nav-item">
              <Cart />
            </li>
            <li className="nav-item">
              {user && user.data ? (
                <a href="#" onClick={handleLogout}>
                  <LogoutIcon />
                </a>
              ) : (
                <a href="/login"> <UserIcon /></a>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
