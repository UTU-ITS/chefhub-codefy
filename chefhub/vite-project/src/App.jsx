import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import LoginView from './components/LoginView'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginView/>}/>
     <Route path="/home" element={<Home/>}/>
    </Routes> 
     
      </BrowserRouter>
    </>
  )
}

export default App
