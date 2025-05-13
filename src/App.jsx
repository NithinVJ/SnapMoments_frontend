import { useState } from 'react'
import'bootstrap/dist/css/bootstrap.min.css'
import'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'
import {BrowserRouter,Routes,Route, useLocation} from 'react-router-dom'
import HomePage from './Components/pages/HomePage'
import LoginPage from './Components/pages/LoginPage'
import SignupPage from './Components/pages/SignupPage'
import Portfolio from './Components/pages/Portfolio'
import Events from './Components/pages/Events'
import Photographer from './Components/pages/Photographer'
import PhotographerPortfolio from './Components/pages/PhotographerPortfolio'
import BookingPage from './Components/pages/BookingPage'
import ClientDashboard from './Components/pages/ClientDashboard';
import PhotographerDashboard from './Components/pages/PhotographerDashboard';
import Navigation from './Components/pages/Navigation';
import PrivateRoute from './Components/pages/PrivateRoute';
import About from './Components/pages/About';
import PortfolioEditModal from './Components/pages/PortfolioEditModal';
import PaymentPage from './Components/pages/PaymentPage';




function App() {
  const isAuthenticated = !!localStorage.getItem("authToken");
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup","/dashboard","/photodashboard","/portfolio","/dashboard/payment/:bookingId"];
  const isNavbarVisible = !hideNavbarRoutes.includes(location.pathname);
  
  return (
    <>
    {isNavbarVisible && <Navigation />}
      <Routes>
        <Route path='/'element={<HomePage />}></Route>
        <Route path='/login'element={<LoginPage />}></Route>
        <Route path='/signup'element={<SignupPage />}></Route>
        <Route path='/portfolio'element={<Portfolio />}></Route>
        <Route path='/events'element={<Events />}></Route>
        <Route path='/photographer'element={<PrivateRoute>
          <Photographer/>
        </PrivateRoute>}></Route>
        <Route path='/photographerportfolio/:id'element={<PhotographerPortfolio />}></Route>
        <Route path='/booking/:id'element={<PrivateRoute><BookingPage /></PrivateRoute>}></Route>
        <Route path='/dashboard'element={<ClientDashboard />}></Route>
        <Route path='/photodashboard'element={<PhotographerDashboard />}></Route>
        <Route path='/about'element={<About />}></Route>
        <Route path="/portfolio/edit/:id" element={<PortfolioEditModal />} />
        <Route path="/dashboard/payment/:bookingId" element={<PaymentPage />} />
      </Routes>
      </>
  )
}

export default App
