import './Titulo1.css'
import Tabla from '../Components/Tabla';
import React, { useEffect,useState } from 'react';
const Mesas = () => {

  const [datos, setDatos] = useState([]);
  const columnas = ['id_mesa','capacidad', 'se_puede_mover', 'area', 'fumadores'];
  useEffect(() => {
    const getMesas = async () => {
      const fetchOptions = {
        method: 'GET',
        
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch('https://cocina.web05.lol/mesasData', fetchOptions)
      if (response.ok){
        const data = await response.json();
        setDatos(data);
      }
    }
    getMesas();
  }, [])

  const datosFormateados = datos.map(fila => ({
    ...fila,
    se_puede_mover: fila.se_puede_mover ? 'Sí' : 'No',
    fumadores: fila.fumadores ? 'Sí' : 'No'
  }));
  
  return (
    <div className='sizesquare'>
      <h1 className="titulo1" style={{marginRight: '20px'}}>MESAS</h1>
      <div style={{width: '730px', height: '500px', overflowY: 'auto'}}>
        <Tabla columnas={columnas} datos={datosFormateados} />
      </div>
    </div>
  )
  

}

export default Mesas