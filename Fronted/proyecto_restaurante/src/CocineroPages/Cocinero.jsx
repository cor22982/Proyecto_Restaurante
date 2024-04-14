// Cocinero.jsx
import React from 'react';
import '../MeseroPages/Titulo1.css';
import TablaBotones from '../Components/TablaBotones';
import CheckboxCustom from '../Components/CheckboxCustom';
import { useEffect, useState } from 'react';
const Cocinero = () => {

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

  const columnas = ['cuenta_id', 'nombre', 'hora_minutos', 'cantidad'];
  

  const renderBoton = (fila) => {
    return (
      <CheckboxCustom
       accion={() => handleClick(fila.cuenta_id)}></CheckboxCustom>
    );
  };

  const handleClick = (nombre) => {
    alert(`Hola ${nombre}!`);
  };

  return (
    <div className='sizesquare'>
      <h1 className="titulo1">ORDENES</h1>
      <div style={{width: '730px', height: '450px', overflowY: 'auto'}}>
        <TablaBotones columnas={columnas} datos={datos} renderBoton={renderBoton} />
      </div>
      
    </div>
  );
};

export default Cocinero;
