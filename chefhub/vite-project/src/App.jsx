import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/Home/NavBar';
import Home from './components/Home/Home';
import LoginView from './components/Login-Register/LoginView';
import Menu from './components/Shop/Menu';
import Checkout from './components/Shop/Checkout';
import AdminOptions from './components/Admin/AdminOptions';
import RegisterView from './components/Login-Register/RegisterView';
import { CartProvider } from './context/cart';
import AddProduct from './components/Admin/Products/AddProduct';
import { UserProvider } from './context/user';
import Reservations from './components/Reservations/Reservations';
import AboutUs from './components/AboutUs/AboutUs';
import ContactUs from './components/ContactUs/ContactUs';
import ForgotPassword from './components/Login-Register/ForgotPassword';
import CustomerAutoManagement from './components/Admin/Users/Customers/CustomerAutoManagement';

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
  return (
    <UserProvider>
    <CartProvider>
      <BrowserRouter>
        <NavBar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/register" element={<RegisterView />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin/*" element={<AdminOptions />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="*" element={<NotFound />} /> {/* Ruta para manejar URLs no existentes */}
            <Route path="/admin/products/addproduct" element={<AddProduct />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/myprofile" element={<CustomerAutoManagement />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
    </UserProvider>
  );
}

export default App;
