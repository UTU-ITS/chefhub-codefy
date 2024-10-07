import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import LoginView from './components/LoginView'
import NavBar from './components/NavBar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   <NavBar></NavBar>
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
