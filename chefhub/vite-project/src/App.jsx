import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home/Home'
import LoginView from './components/Login-Register/LoginView'
import NavBar from './components/Home/NavBar'
import Menu from './components/Shop/Menu'
import Checkout from './components/Shop/Checkout'
import AdminOptions from './components/Admin/AdminOptions'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <NavBar></NavBar>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<LoginView/>}/>
        <Route path="/menu" element={<Menu/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/admin/*" element={<AdminOptions/>}/>
      </Routes> 
    </BrowserRouter>
    
    </>
  )
}

export default App
