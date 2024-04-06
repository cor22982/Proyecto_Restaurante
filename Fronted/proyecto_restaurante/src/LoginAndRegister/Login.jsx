import React from 'react';
import './Login.css';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import TextInput from '../Components/TextInput';
import ButtonCustom from '../Components/ButtonCustom';
const Login = () =>{
  return ( 
    <div className="wrapper">
      <h1>Iniciar Sesion</h1>
      <TextInput icono={faUser} placeholder="Usuario" type="text" />
      <TextInput icono={faLock} placeholder="Constraseña" type="password" />
      <ButtonCustom type='submit' nombre='Iniciar Sesion'></ButtonCustom>
    </div>
  );
}

export default Login