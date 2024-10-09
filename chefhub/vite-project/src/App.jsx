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
<<<<<<< HEAD
    <NavBar></NavBar>
=======
   <NavBar></NavBar>
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>}/>
     <Route path="/login" element={<LoginView/>}/>
     <Route path="/menu" element={<Menu/>}/>
>>>>>>> 3a4db276cde5b444cf2b22e9cff54c6390f2de46

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginView/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/menu" element={<Menu/>}/>
      </Routes> 
    </BrowserRouter>
    
    </>
  )
}

export default App
