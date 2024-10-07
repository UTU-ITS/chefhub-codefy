import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import LoginView from './components/LoginView'
import NavBar from './components/NavBar'
import Menu from './components/Menu'

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

     
    </Routes> 
     
    </BrowserRouter>
    </>
  )
}

export default App
