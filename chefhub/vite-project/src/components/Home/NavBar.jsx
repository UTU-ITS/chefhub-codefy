import React, { useState, useContext, useEffect } from 'react';
import './NavBar.css';
import { CartIcon, UserIcon, SearchIcon, AdminIcon, LogoutIcon, UserCircleIcon } from '../../img/HeroIcons';
import Logo from '../../assets/logo.svg';
import Cart from '../Shop/Cart';
import { UserContext } from '../../context/user';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useContext(UserContext);

  // Debug: Verificar cambios en el usuario
  useEffect(() => {
  }, [user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false); // Cerrar el menú después de cerrar sesión
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
            <li className="nav-item">
              <a href="/aboutus">Sobre Nosotros</a>
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
              </>
            )}
            <li className="nav-item">
              <Cart />
            </li>
            <li className="nav-item">
              {user && user.data ? (
                <div className="user-menu-container">
                  <a onClick={toggleUserMenu} className="user-icon-button">
                    <UserIcon />
                  </a>
                  {isUserMenuOpen && (
                    <ul className="user-menu">
                      <li>
                        <a href="/myprofile" onClick={() => setIsUserMenuOpen(false)}>Mi perfil</a>
                      </li>
                      <li>
                        <a href="/myorders" onClick={() => setIsUserMenuOpen(false)}>Mis pedidos</a>
                      </li>
                      <li>
                        <a href="/login">
                          <button onClick={handleLogout}>Cerrar sesión</button>
                        </a>
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <a href="/login"> <UserCircleIcon /></a>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;