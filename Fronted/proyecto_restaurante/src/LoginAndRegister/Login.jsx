import React from 'react';
import './Login.css';
import { md5 } from 'js-md5'
import { useState } from 'react'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import TextInput from '../Components/TextInput';
import ButtonCustom from '../Components/ButtonCustom';
const Login = ({setAccessToken,setLoggedIn}) =>{
  const [formState, setFormState] = useState({ username: '',password: ''})
  const [errorMessage, setErrorMessage] = useState('')

  
  const setValue = (name, value) => {
    setFormState({
      ...formState,
      [name]: value
    })
  }

  const handleClick = async () => {
    const body = { }
    body.username = formState.username
    body.password = md5(formState.password)
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch('https://cocina.web05.lol/login', fetchOptions)
    // Aquí puedes agregar la lógica que desees ejecutar cuando el botón sea clicado
    if (response.ok) {
      const data = await response.json();
      const { acces_token} = data;
      setAccessToken(acces_token)
      setLoggedIn(true)
      setErrorMessage('')
      return
    }
    setErrorMessage('Incorrect user or password')
  }
  return ( 
    <div className="wrapper">
      <h1>Iniciar Sesion</h1>
      {
        errorMessage !== '' ? (
          <div className='error-message' onClick={() => setErrorMessage('')}>
            {errorMessage}
          </div>
        ) : null
      }

      <TextInput 
        icono={faUser} 
        placeholder="Usuario" 
        type="text" 
        value={formState.username} 
        onChange={(value) => setValue('username', value)}
        />
      <TextInput 
        icono={faLock} 
        placeholder="Constraseña" 
        type="password"
        value={formState.password} 
        onChange={(value)=> setValue('password',value)}
        />

      <p style={{ fontSize: '15px' }}>
          ¿No te has registrado aún? <Link to="/register" style={{ fontSize: '16px', fontWeight: 'bold', color: 'white'}}>Regístrate aquí</Link>
      </p>
      <ButtonCustom 
        type='submit' 
        nombre='Iniciar Sesion'
        onClick={handleClick}></ButtonCustom>
    </div>
  );
}

export default Login