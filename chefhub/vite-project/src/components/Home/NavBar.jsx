import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './NavBar.css';
import { UserIcon } from '../../img/HeroIcons';
import Logo from '../../assets/logo.svg';

const NavBar = () => {
  return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img  alt="Chef Hub Logo" src={Logo} style={{ width: '60px' }} />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/menu">Menu</a>
              </li>
              <li className="nav-item"> 
                <a className="nav-link" href="/login">
                  <button className='nav-item'>
                    <UserIcon/>
                  </button>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  );
};

export default NavBar;




