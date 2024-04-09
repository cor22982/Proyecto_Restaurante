import './Titulo1.css'
import Tabla from '../Components/Tabla';
import React, { useEffect,useState } from 'react';
const Platos = () => {
  const [datos, setDatos] = useState([]);
  const columnas = ['id', 'nombre', 'tipo', 'precio', 'descripcion'];
  useEffect(() => {
    const getFood = async () => {
      const fetchOptions = {
        method: 'GET',
        
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch('https://cocina.web05.lol/foodData', fetchOptions)
      if (response.ok){
        const data = await response.json();
        setDatos(data);
      }
    }
    getFood();
  }, [])
  return (
    <div className='sizesquare'>
      <h1 className="titulo1" style={{marginRight: '20px'}}>PLATOS</h1>
      <div style={{width: '730px', height: '500px', overflowY: 'auto'}}>
        <Tabla columnas={columnas} datos={datos} />
      </div>
    </div>
  )
}

export default Platos