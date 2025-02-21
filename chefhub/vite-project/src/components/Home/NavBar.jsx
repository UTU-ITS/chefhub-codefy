import React, { useState, useContext, useEffect } from 'react';
import './NavBar.css';
import { CartIcon, UserIcon, AdminIcon, UserCircleIcon } from '../../img/HeroIcons';
import Logo from '../../assets/logo.svg';
import Cart from '../Shop/Cart';
import { UserContext } from '../../context/user';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useContext(UserContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  const checkScreenSize = () => {
    setIsMobile(window.innerWidth <= 1035);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <nav className="custom-navbar">
      <div className="nav-container">
        {/* Logo */}
        <div>
          <a className="navbar-brand" href="/">
            <img alt="Chef Hub Logo" src={Logo} style={{ width: '40px' }} />
          </a>
        </div>

        {/* Botón de menú hamburguesa */}
        <button className="nav-toggle" onClick={toggleMenu}>
          <span className="nav-toggle-icon"></span>
          <span className="nav-toggle-icon"></span>
          <span className="nav-toggle-icon"></span>
        </button>

        {/* Menú de navegación */}
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="nav-menu-middle">
          <ul className="nav-list">
            <li className="nav-item"><a href="/" onClick={() => setIsMenuOpen(false)}>Inicio</a></li>
            <li className="nav-item"><a href="/menu" onClick={() => setIsMenuOpen(false)}>Menú</a></li>
            <li className="nav-item"><a href="/reservations" onClick={() => setIsMenuOpen(false)}>Reserva tu mesa</a></li>
            <li className="nav-item"><a href="/aboutus" onClick={() => setIsMenuOpen(false)}>Sobre Nosotros</a></li>
            <li className="nav-item"><a href="/contact" onClick={() => setIsMenuOpen(false)}>Contáctanos</a></li>

            {user && user.data ? (
              <>
                {/* Botón Admin en MÓVIL si el usuario tiene el cargo correcto */}
                {isMobile && (["Chef", "Mesero", "Administrativo"].includes(user.data.cargo)) && (
                  <li className="nav-item">
                    <a href="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <AdminIcon />
                    </a>
                  </li>
                )}

                {/* En móvil se muestran "Mi perfil" y "Cerrar sesión" */}
                {isMobile && (
                  <>
                    <li className="nav-item">
                      <a href="/myprofile" onClick={() => setIsMenuOpen(false)}>Mi perfil</a>
                    </li>
                    <li className="nav-item">
                      <a href="/login" onClick={handleLogout}>Cerrar sesión</a>
                    </li>
                  </>
                )}
              </>
            ) : (
              /* En móvil se muestra "Iniciar sesión" si no está autenticado */
              isMobile && (
                <li className="nav-item">
                  <a href="/login" onClick={() => setIsMenuOpen(false)}>Iniciar sesión</a>
                </li>
              )
            )}
          </ul>
        </div>


          {/* Menú de usuario para escritorio */}
          <div className="nav-menu-right">
            {user && user.data ? (
              <>
                {/* Botón de Admin solo si el usuario es Chef, Mesero o Administrativo, y no es un móvil */}
                {!isMobile && (user.data.cargo === "Chef" || user.data.cargo === "Mesero" || user.data.cargo === "Administrativo") && (
                  <li className="nav-item">
                    <a href="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <AdminIcon />
                    </a>
                  </li>
                )}

                {/* Menú de usuario */}
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
                        <a href="/login" onClick={handleLogout}>
                          <button>Cerrar sesión</button>
                        </a>
                      </li>
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <div className="guest-menu-navbar">
                <a href="/login"><UserCircleIcon /></a>
                <a onClick={() => setIsMenuOpen(false)}><Cart /></a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
