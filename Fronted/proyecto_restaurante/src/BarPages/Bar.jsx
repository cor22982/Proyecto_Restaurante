import React from 'react';
import '../MeseroPages/Titulo1.css'
import TablaBotones from '../Components/TablaBotones';
import CheckboxCustom from '../Components/CheckboxCustom';
import { useEffect, useState } from 'react';

const Bar = () => {

  const [bebida, setBebida] = useState({bebidaid: '', cuentaid: ''})
  const [errorMessage, setErrorMessage] = useState('')
  const [datos , setDatos] = useState([]);


  const setValue = (newData) => {
    setBebida({
      ...bebida,
      ...newData
    });
  };

  const getbebida = async () =>{
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch('https://cocina.web05.lol/barOrders', fetchOptions)
    if (response.ok){
      const data = await response.json();
      setDatos(data)
    }
  }

  useEffect ( () => {
    getcomida()
  },[]) 

  const columnas = ['cuenta_id', 'bebida','nombre', 'hora_minutos', 'cantidad'];
  
  const renderBoton = (fila) => {
    return (
      <CheckboxCustom
       accion={() => handleClick(fila.bebida,fila.cuenta_id)}></CheckboxCustom>
    );
  };

  return (

  );
}

export default Bar