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
              <a className="nav-link" href="/">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/menu">Menú</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/reservations">Reserva tu mesa</a>
            </li>
            {!user?.data && (
            <li className="nav-item">
              <a className="nav-link" href="/register">Registrarme</a>
            </li>
             )}
            <li className="nav-item">
              <a className="nav-link" href="/about">Sobre Nosotros</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/contact">Contáctanos</a>
            </li>
  {user && user.data && (user.data.cargo === "Chef" || user.data.cargo === "Mesero" || user.data.cargo === "Administrativo") && (
  <>

    <li className="nav-item dropdown">
    
      <a className="nav-link" href="/admin">
        Administrar <span className="dropdown-arrow">▼</span>
      </a>
       
      <ul className="dropdown-menu">
      {user && user.data && user.data.cargo === "Administrativo" && (
        <>
        <li><a className="dropdown-item" href="/sub-opcion-1">Personalización del portal</a></li>
        <li><a className="dropdown-item" href="/sub-opcion-2">Productos</a></li>
        <li><a className="dropdown-item" href="/sub-opcion-3">Funcionarios</a></li>
        <li><a className="dropdown-item" href="/sub-opcion-3">Clientes</a></li>
        <li><a className="dropdown-item" href="/sub-opcion-3">Preferencias</a></li>
        <li><a className="dropdown-item" href="/sub-opcion-3">Informes</a></li>
      </>
    )}
        {user && user.data && (user.data.cargo === "Mesero" || user.data.cargo === "Administrativo") &&(
        <li><a className="dropdown-item" href="/sub-opcion-3">Reservas</a></li>
      )}
        {user && user.data && (user.data.cargo === "Chef" || user.data.cargo === "Mesero" || user.data.cargo === "Administrativo") && (
        <li><a className="dropdown-item" href="/sub-opcion-3">Pedidos</a></li>
      )}
        
      </ul>
    </li>
  </>)}
          </ul>
        </div>

        {/* Menú derecho */}
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-list">
          {user && user.data && (user.data.cargo === "Chef" || user.data.cargo === "Mesero" || user.data.cargo === "Administrativo") && (
            <>
          <li className="nav-item">
              <a className="nav-link right" href="/admin/dashboard">
                <AdminIcon />
              </a>
            </li>
            </>)}
            <li className="nav-item">
              <Cart />
            </li>
            <li className="nav-item">
              {user && user.data ? (
             <button className="logout-btn" onClick={handleLogout}>
             <LogoutIcon />
           </button> 
                            
              ) : (
                    <a className="nav-link right" href="/login"> <UserIcon /></a>   
                     )}
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
