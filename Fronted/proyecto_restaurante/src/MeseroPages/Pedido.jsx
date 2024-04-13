import './Titulo1.css'
import Tabla from '../Components/Tabla';
import TextoCustom from '../Components/TextoCustom';
import ButtonSmall from '../Components/ButtonSmall';
const Pedido = ({cuenta}) => {

  const columnas = ['cantidad','plato','descripcion','preciounidad','preciototal'];
  const datos = [
    { Cantidad: '3', Plato: 'Hamburguesa', Descripcion: 'Deliciosa hamburguesa con queso y vegetales', PrecioUnidad: 'Q8.99', PrecioTotal: 'Q26.97' },
  ];
  return (
    <div className='sizesquare'>
      <div style={{flexDirection: 'row', display: 'flex'}}>
        <h1 className="titulo1" style={{marginLeft: '20px'}}>Pedido {cuenta}</h1>
      </div>
      <div style={{width: '730px', height: '400px', overflowY: 'auto'}}>
        <Tabla columnas={columnas} datos={datos} />
      </div>
      
      <div style={{flexDirection: 'row', display: 'flex', alignItems:'end'}}>
        <TextoCustom titulo="Total: Q.0.00" fontSize="36px" lineWidth="290px"></TextoCustom>
        <ButtonSmall name="Ordenar"></ButtonSmall>
      </div>
      
    </div>
  ); 
}

export default Pedido