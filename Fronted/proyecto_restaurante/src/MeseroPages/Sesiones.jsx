import './Titulo1.css'
import SesionComponet from '../Components/SesionComponet';
import ButtonSmall from '../Components/ButtonSmall';
import React, { useEffect,useState } from 'react';
const Sesiones = ({setFormState,setSesionState}) => {
  const [sesiones, setSesiones] = useState([]);
  const getSesiones = async () => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch('https://cocina.web05.lol/idsession', fetchOptions)
    if (response.ok){
      const data = await response.json();
      setSesiones(data);
    }
  }

  const clickcomponet = ({item}) => {
    setSesionState(item)
    setFormState('cuentas')
  }
  useEffect(() => {
    
    getSesiones();
  }, [])


  const handleClick = async() => {
    const body = { }
    body.token = localStorage.getItem('accessToken')
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch('https://cocina.web05.lol/insertfirstsession', fetchOptions)
    if (response.ok) {
      getSesiones();
      console.log('succes')
      return
    }
  }
  return (
    <div className='sizesquare'>
      <h1 className="titulo1">SESIONES EN CURSO</h1>
      <ul className='lista'>
        {sesiones.map((sesion) => (
          <SesionComponet 
            key={sesion.id} 
            nombre={'Sesion ' + sesion.id} 
            onclick={() => clickcomponet({item: sesion.id})}
          ></SesionComponet>
        ))}
      </ul>
      <ButtonSmall name='Agregar' onclick={handleClick}></ButtonSmall>
      
    </div>
    
  );
}

export default Sesiones