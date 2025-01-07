import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NavBar from './components/Home/NavBar'
import Home from './components/Home/Home'
import LoginView from './components/Login-Register/LoginView'
import Menu from './components/Shop/Menu'
import Checkout from './components/Shop/Checkout'
import AdminOptions from './components/Admin/AdminOptions'
import RegisterView from './components/Login-Register/RegisterView'
import { CartProvider } from './context/cart'
import AddProduct from './components/Admin/AddProduct'

function App() {

  return (
    <>
<<<<<<< HEAD
    <NavBar></NavBar>
    <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<LoginView/>}/>
        <Route path="/menu" element={<Menu/>}/>
        <Route path="/register" element={<RegisterView/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/admin/*" element={<AdminOptions/>}/>
      </Routes> 
    </BrowserRouter>
    </CartProvider>
    
=======
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
>>>>>>> b8ad6c322ce53d6f4cd426bef88df9edaf4260e8
    </>
  )
}

export default App
