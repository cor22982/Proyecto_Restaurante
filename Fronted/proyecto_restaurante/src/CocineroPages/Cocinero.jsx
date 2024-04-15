// Cocinero.jsx
import React from 'react';
import '../MeseroPages/Titulo1.css';
import TablaBotones from '../Components/TablaBotones';
import CheckboxCustom from '../Components/CheckboxCustom';
import { useEffect, useState } from 'react';
const Cocinero = () => {

  const [plato, setPlato] = useState({platoid: '', cuentaid: ''})
  const [errorMessage, setErrorMessage] = useState('')


  const setValue = (newData) => {
    setPlato({
      ...plato,
      ...newData
    });
  };


  const deletecomida = async () => {
    const fetchOptions = {
      method: 'DELETE',
      body: JSON.stringify(plato),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch('https://cocina.web05.lol/deleteordencocina', fetchOptions);  
    if (response.ok){
      setErrorMessage('Se ha preparado este plato')
      return
    }
    setErrorMessage('No se ha logrado notificar su preparacion')
  }

  const [datos , setDatos] = useState([]);
  const getcomida = async () =>{
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch('https://cocina.web05.lol/kitchenOrders', fetchOptions)
    if (response.ok){
      const data = await response.json();
      setDatos(data)
    }
  }

  useEffect ( () => {
    getcomida()
  },[]) 

  const columnas = ['cuenta_id', 'plato','nombre', 'hora_minutos', 'cantidad'];
  

  const renderBoton = (fila) => {
    return (
      <CheckboxCustom
       accion={() => handleClick(fila.plato,fila.cuenta_id)}></CheckboxCustom>
    );
  };

  const handleClick = async (plato,cuenta) => {
    setValue({
      platoid: plato,
      cuentaid: cuenta
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await deletecomida();
    await getcomida()
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
};

export default Cocinero;
