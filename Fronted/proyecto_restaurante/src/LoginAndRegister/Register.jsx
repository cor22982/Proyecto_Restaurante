import React from 'react';
import './Login.css';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import TextInput from '../Components/TextInput';
import DropdownCustom from '../Components/DropdownCustom';
import ButtonCustom from '../Components/ButtonCustom';
const Register = () =>{



  return ( 
    <div className="wrapper">
      <h1>Registrarse</h1>
      <TextInput icono={faUser} placeholder="Ingresar usuario" type="text" />
      <TextInput icono={faLock} placeholder="Ingresar constraseña" type="password" />
      <DropdownCustom nombre="Seleccionar rol" lista = {['mesero', 'cheff','barista']}></DropdownCustom>
      <ButtonCustom type='submit' nombre='Registrarse'></ButtonCustom>
    </div>
  );
}

export default Register