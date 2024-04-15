import '../MeseroPages/Titulo1.css'
import Tabla from '../Components/Tabla';
import { useState } from 'react';
import { faCalendar} from '@fortawesome/free-solid-svg-icons';
import TextInputSmall from '../Components/TextInputSmall';
import ButtonSmall from '../Components/ButtonSmall';

const Queja_Persona = () => {
  const columnas = ['persona', 'total_quejas'];
  const [datos, setDatos] = useState([]);
  const [fechas, setFechas] = useState({fechainicio: '' , fechafinal: ''})
  const setValue = (name, value) => {
    setFechas({
      ...fechas,
      [name]: value
    })
  }

  const getDatos = async () => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(`https://cocina.web05.lol/quejasbyname?fecha_inicio=${fechas.fechainicio}&fecha_fin=${fechas.fechafinal}`, fetchOptions)
    if (response.ok){
      const data = await response.json();
      setDatos(data)
      return
    }
  }

  return (
    <div className='sizesquare'>
      <h1 className="titulo1">Queja Persona</h1>
      <h2 style={{color: 'white', fontSize: '20px', marginLeft: '16px'}}>Reporte de las quejas agrupadas por persona</h2>
      <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '20px' }}>
        <TextInputSmall
          icono={faCalendar}
          placeholder="Fecha Inicio"
          type="text"
          value={fechas.fechainicio}
          onChange={(value)=> setValue('fechainicio',value)}></TextInputSmall>
        <div style={{marginLeft: '10px'}}>
          <TextInputSmall
            icono={faCalendar}
            placeholder="Fecha Final"
            type="text"
            value={fechas.fechafinal}
            onChange={(value)=> setValue('fechafinal',value)} ></TextInputSmall>
        </div>
        
      </div>
      <ButtonSmall name= "Buscar" onclick={getDatos}></ButtonSmall>
      <br></br>
      
      <div style={{width: '730px', height: '350px', overflowY: 'auto'}}>
        <Tabla columnas={columnas} datos={datos} />
      </div>
    </div>
  );

}

export default Queja_Persona