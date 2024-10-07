import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './NavBar.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
export default function NavBar() {
    return (
      <nav className="navbar fixed-top navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Navbar</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-item-container">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/home">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/menu">Menu</a>
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
            <input id="txt-search-ph" className="txt-area-search" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn" type="submit">Search</button>
            <a className="btn" href ="/login">Iniciar Sesion</a>
          </form>
        </div>
      </div>
    </nav>
    );
  }
  






