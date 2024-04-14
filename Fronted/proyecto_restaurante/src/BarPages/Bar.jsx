import React from 'react';
import '../MeseroPages/Titulo1.css'
import TablaBotones from '../Components/TablaBotones';
import CheckboxCustom from '../Components/CheckboxCustom';
import { useEffect, useState } from 'react';

const Bar = () => {

  const [bebida, setBebida] = useState({bebidaid: '', cuentaid: ''})
  const [errorMessage, setErrorMessage] = useState('')
  const [datos , setDatos] = useState([]);
  const columnas = ['cuenta_id', 'bebida','nombre', 'hora_minutos', 'cantidad'];

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
    getbebida()
  },[]) 


  const handleClick = async (bebida,cuenta) => {
    setValue({
      bebidaid: bebida,
      cuentaid: cuenta
    });
  };

  
  
  const renderBoton = (fila) => {
    return (
      <CheckboxCustom
       accion={() => handleClick(fila.bebida,fila.cuenta_id)}></CheckboxCustom>
    );
  };




  return (
    <div className='sizesquare'>
      <h1 className="titulo1">ORDENES</h1>
      <div style={{width: '730px', height: '450px', overflowY: 'auto'}}>
        <TablaBotones columnas={columnas} datos={datos} renderBoton={renderBoton} />
      </div>
      {
        errorMessage !== '' ? (
          <div className='error-message' onClick={() => setErrorMessage('')}>
            {errorMessage}
          </div>
        ) : null
      }
    </div>

  );
}

export default Bar