import React from 'react';
import './Login.css';
import { md5 } from 'js-md5';
import { useState } from 'react';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import TextInput from '../Components/TextInput';
import DropdownCustom from '../Components/DropdownCustom';
import ButtonCustom from '../Components/ButtonCustom';
const Register = () =>{
  const [formState, setFormState] = useState({ username: '',password: '', rol: ''})
  const [errorMessage, setErrorMessage] = useState('')

  const setValue = (name, value) => {
    setFormState({
      ...formState,
      [name]: value
    })
  }

  const handleDropdownChange = (selectedItem) => {
    setValue('rol', selectedItem);
  }

  const click = async () => {
    const body = { }
    body.username = formState.username
    body.password = md5(formState.password)
    body.rol = formState.rol
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch('https://cocina.web05.lol/register', fetchOptions)
    
    if (response.ok) {
      console.log('success!')
      setErrorMessage('')
      return
    }else{
      setErrorMessage('Esta intentando ingresar a un usuario no admitido')
    }
  }



  return ( 
    <div className="wrapper">
      <h1>Registrarse</h1>
      {
        errorMessage !== '' ? (
          <div className='error-message' onClick={() => setErrorMessage('')}>
            {errorMessage}
          </div>
        ) : null
      }
      <TextInput 
        icono={faUser} 
        placeholder="Ingresar usuario" 
        type="text" 
        value={formState.username} 
        onChange={(value) => setValue('username', value)}  
        />
      <TextInput 
        icono={faLock} 
        placeholder="Ingresar constraseña" 
        type="password" 
        value={formState.password}
        onChange={(value) => setValue('password',value)}
        />
      <DropdownCustom 
        nombre="Seleccionar rol" 
        lista = {['mesero', 'cheff','barista']}
        onChange={handleDropdownChange}></DropdownCustom>
      <ButtonCustom 
        type='submit' 
        nombre='Registrarse'
        onClick={click}></ButtonCustom>
    </div>
  );
}

export default Register