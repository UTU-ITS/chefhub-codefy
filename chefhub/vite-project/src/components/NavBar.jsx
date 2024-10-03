import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './NavBar.css';
export default function NavBar() {
    return (
        <nav className="navbar fixed-top navbar-expand-lg ">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Navbar</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Inicio</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Menu</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Contacto</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Gestion
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#">Gestion de Productos</a></li>
                  <li><a className="dropdown-item" href="#">Gestion de Pedidos</a></li>
                  <li><a className="dropdown-item" href="#">Gestion de Restaurante</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#">Gestion de Personal</a></li>
                </ul>
              </li>
            
            </ul>
            <form className="nav-search d-flex" role="search">
              <input className="txt-area" type="search" placeholder="Search" aria-label="Search"/>
              <button className="btn" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>
     
    );
  }
  







