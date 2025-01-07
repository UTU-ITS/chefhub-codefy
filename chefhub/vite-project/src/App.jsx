import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import NavBar from './components/Home/NavBar'
import Home from './components/Home/Home'
import LoginView from './components/Login-Register/LoginView'
import Menu from './components/Shop/Menu'
import Checkout from './components/Shop/Checkout'
import AdminOptions from './components/Admin/AdminOptions'
import { CartProvider } from './context/cart'
import AddProduct from './components/Admin/Products/AddProduct'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </CartProvider>
  );
}

function MainApp() {
  const location = useLocation(); // Hook para obtener la ruta actual

  // Oculta NavBar para cualquier ruta que comience con "/admin"
  const shouldShowNavBar = !location.pathname.startsWith('/admin');

  return (
    <>
      {shouldShowNavBar && <NavBar />} {/* Renderiza NavBar solo si no está en /admin */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/*" element={<AdminOptions />} />
          <Route path="/admin/products/addproduct" element={<AddProduct />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
