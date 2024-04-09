import './Titulo1.css'
import Tabla from '../Components/Tabla';
import TextoCustom from '../Components/TextoCustom';
import ButtonSmall from '../Components/ButtonSmall';
const Factura = () => {
  const columnas = ['Descripcion', 'Cantidad', 'Precio'];
  const datos = [
    {
      Descripcion: 'Deliciosa hamburguesa con queso y vegetales',
      Cantidad: '3',
      Precio: 'Q26.97'
    },{}
  ]
  return (
    <div className='sizesquare'>
      <div style={{flexDirection: 'row', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
        <h1 className="titulo1" style={{marginRight: '20px'}}>FACTURA NO 1</h1>
      </div>
      <h1 className='titulo2' style={{marginLeft: '20px'}}>Informacion</h1>
      <div style={{flexDirection: 'row', display: 'flex'}}>
        <h2 style={{color: 'white', fontSize: '16px', marginLeft: '16px'}}>Nombre: Mathew Cordero</h2>
        <h2 style={{color: 'white', fontSize: '16px', marginLeft: '16px'}}>Direccion: 5ta calle B  57-63 Paraiso z 18</h2>
        <h2 style={{color: 'white', fontSize: '16px', marginLeft: '16px'}}>NIT: 00000000000</h2>
      </div>
      <div style={{width: '730px', height: '350px', overflowY: 'auto'}}>
        <Tabla columnas={columnas} datos={datos} />
      </div>
      <div style={{flexDirection: 'row', display: 'flex', alignItems:'end'}}>
        <TextoCustom titulo="Total: Q.0.00" fontSize="26px" lineWidth="290px"></TextoCustom>
        <ButtonSmall name="Imprimir"></ButtonSmall>
      </div>
    </div>
    
    
  );
}

export default Factura