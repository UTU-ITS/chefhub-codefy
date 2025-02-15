import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react';
import './App.css';
import NavBar from './components/Home/NavBar';
import Home from './components/Home/Home';
import LoginView from './components/Login-Register/LoginView';
import Menu from './components/Shop/Menu';
import Checkout from './components/Shop/Checkout';
import AdminOptions from './components/Admin/AdminOptions';
import RegisterView from './components/Login-Register/RegisterView';
import { CartProvider } from './context/cart';
import { UserProvider } from './context/user';
import Reservations from './components/Reservations/Reservations';
import AboutUs from './components/AboutUs/AboutUs';
import ContactUs from './components/ContactUs/ContactUs';
import ForgotPassword from './components/Login-Register/ForgotPassword';
import CustomerAutoManagement from './components/Admin/Users/Customers/CustomerAutoManagement';
import Aftercheckout from './components/Shop/Aftercheckout';
import AfterCheckoutInside from './components/Shop/AfterCheckoutInside';
import AfterChekoutFail from './components/Shop/AfterCheckoutFail';
import { useEffect, useState } from 'react';
import './design.css';

function NotFound() {
  
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
      <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>Volver al inicio</a>
    </div>
  );
}

function App() {

  const [color, setColor] = useState(null);

  useEffect(() => {
    const fetchColor = async () => {
      try {
        const response = await fetch("http://192.168.0.10:8080/api/personalization/color"); // URL de tu API en PHP
        const data = await response.json();
        setColor(data.color);
        function hexToRgba(hex, alpha) {
          let r = parseInt(hex.slice(1, 3), 16);
          let g = parseInt(hex.slice(3, 5), 16);
          let b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      
      document.documentElement.style.setProperty("--primary-color", data.color);
      document.documentElement.style.setProperty("--primary-color-light", hexToRgba(data.color, 0.1)); // 50% de opacidad
      
      } catch (error) {
        console.error("Error al obtener el color:", error);
      }
    };

    fetchColor();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Si el color aún no se ha cargado, podemos establecer un color predeterminado
  if (color === null) {
    document.documentElement.style.setProperty("--primary-color", "#ffffff"); // Blanco por defecto
  }

  return (
    <ChakraProvider>
      <UserProvider>
        <CartProvider>
          <Router>
            <NavBar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/login" element={<LoginView />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/register" element={<RegisterView />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/success" element={<Aftercheckout />} />
                <Route path="/successin" element={<AfterCheckoutInside />} />
                <Route path="/fail" element={<AfterChekoutFail />} />
                <Route path="/admin/*" element={<AdminOptions />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/myprofile" element={<CustomerAutoManagement />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </UserProvider>
    </ChakraProvider>
  );
}

export default App;