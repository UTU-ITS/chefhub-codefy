import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
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

function App() {

  return (
    <UserProvider>
    <CartProvider>
      <BrowserRouter>
      <NavBar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/register" element={<RegisterView />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin/*" element={<AdminOptions />} />
            <Route path="/admin/products/addproduct" element={<AddProduct />} />
            <Route path="/reservations" element={<Reservations />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
    </UserProvider>
  );
}

export default App;
