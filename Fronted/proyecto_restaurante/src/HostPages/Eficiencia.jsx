import '../MeseroPages/Titulo1.css'
import Tabla from '../Components/Tabla';
import { useState,useEffect } from 'react';
const Eficiencia = () => {
  const columnas = ['nombre', 'month','amabilidad','exactitud'];
  const [datos, setDatos] = useState([]);

  const getDatos = async () => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch('https://cocina.web05.lol/performance', fetchOptions)
    if (response.ok){
      const data = await response.json();
      setDatos(data)
      return
    }
  }

  useEffect(() => {
    getDatos();
  }, []);
  
  return (
    <div className='sizesquare'>
      <h1 className="titulo1">Reporte de eficiencia</h1>
      <h2 style={{color: 'white', fontSize: '20px', marginLeft: '16px'}}>Reporte de eficiencia de meseros mostrando para los últimos 6 meses.</h2>
      <div style={{width: '730px', height: '350px', overflowY: 'auto'}}>
        <Tabla columnas={columnas} datos={datos} />
      </div>
    </div>
  )
}

export default Eficiencia