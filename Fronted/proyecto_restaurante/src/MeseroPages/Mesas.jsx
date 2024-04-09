import './Titulo1.css'
import Tabla from '../Components/Tabla';
const Mesas = () => {
  const columnas = ['ID_Mesa', 'Capacidad', 'Se_puede_mover', 'Area', 'Fumadores'];
  const datos = [
    {
      ID_Mesa: '1',
      Capacidad: '3',
      Se_puede_mover: 'SI',
      Area: 'Central',
      Fumadores: 'SI'

    },{}
  ]
  return (
    <div className='sizesquare'>
      <h1 className="titulo1" style={{marginRight: '20px'}}>MESAS</h1>
      <div style={{width: '730px', height: '500px', overflowY: 'auto'}}>
        <Tabla columnas={columnas} datos={datos} />
      </div>
    </div>
  )
  

}

export default Mesas