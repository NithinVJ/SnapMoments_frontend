import { useState } from 'react'
import'bootstrap/dist/css/bootstrap.min.css'
import'bootstrap/dist/js/bootstrap.bundle.min.js'
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import HomePage from './Components/pages/HomePage'
import LoginPage from './Components/pages/LoginPage'
import SignupPage from './Components/pages/SignupPage'
import Portfolio from './Components/pages/Portfolio'
import Events from './Components/pages/Events'
import Photographer from './Components/pages/Photographer'




function App() {
  
  
  return (
    <BrowserRouter>
    <div className='app'>
      <Routes>
        <Route path='/'element={<HomePage />}></Route>
        <Route path='/login'element={<LoginPage />}></Route>
        <Route path='/signup'element={<SignupPage />}></Route>
        <Route path='/portfolio'element={<Portfolio />}></Route>
        <Route path='/events'element={<Events />}></Route>
        <Route path='/photographer'element={<Photographer />}></Route>
      </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
