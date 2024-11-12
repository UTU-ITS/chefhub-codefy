import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home/Home'
import LoginView from './components/Login-Register/LoginView'
import NavBar from './components/Home/NavBar'
import Menu from './components/Shop/Menu'
import Checkout from './components/Shop/Checkout'
import AdminOptions from './components/Admin/AdminOptions'
import { CartProvider } from './context/cart'
import AddProduct from './components/Admin/AddProduct'

function App() {

  return (
    <>
      <CartProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin/*" element={<AdminOptions />} />
            <Route path="/admin/products/addproduct" element={<AddProduct />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </>
  )
}

export default App
