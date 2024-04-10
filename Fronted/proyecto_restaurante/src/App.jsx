import React, { useState,useEffect } from 'react';
import './App.css'
import Register from './LoginAndRegister/Register'
import Login from './LoginAndRegister/Login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Initial from './Pages/Initial';

function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))
  const [loggedin, setLoggedIn] = useState(localStorage.getItem('loggedin') === 'true');
  // Actualizar el objeto en localStorage cuando cambie el nombre de usuario o el token de acceso
  useEffect(() => {
    localStorage.setItem('accessToken',accessToken)
  }, [accessToken]);
  
  useEffect(() => {
    localStorage.setItem('loggedin', loggedin);
  }, [loggedin]);


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={ loggedin ? <Initial token={accessToken}/>:<Login setAccessToken={setAccessToken} setLoggedIn={setLoggedIn}/>}
        />
        <Route
          path='/register'
          element={loggedin ? <Initial token={accessToken}/> : <Register/>}
        />
        {/* Añade más rutas aquí */}
      </Routes>
    </Router>
  )
}

export default App
