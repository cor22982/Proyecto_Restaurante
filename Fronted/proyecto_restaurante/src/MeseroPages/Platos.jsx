import './Titulo1.css'
import Tabla from '../Components/Tabla';
const Platos = () => {
  const columnas = ['Id', 'Nombre', 'Descripcion', 'Tipo', 'Precio'];
  const datos = [
    {
      Id: '1',
      Nombre: 'Hamburguesa',
      Descripcion: 'Deliciosa hamburguesa con queso y vegetales',
      Tipo: 'comida',
      Precio: 'Q8.99'

    },{}
  ]
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