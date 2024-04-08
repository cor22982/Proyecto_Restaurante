import './Titulo1.css'
import TextoCustom from '../Components/TextoCustom';
import ButtonSmall from '../Components/ButtonSmall';
import Dropboxsmall from '../Components/Dropboxsmall';
import TextInputSmall from '../Components/TextInputSmall';
import { fa1,faSearch } from '@fortawesome/free-solid-svg-icons';
const CuentaUnica = () => {
  return (
    <div className='sizesquare'>
      <div style={{flexDirection: 'row', display: 'flex'}}>
        <h1 className="titulo1" style={{marginLeft: '20px'}}>Cuenta 1</h1>
        <h1 className='titulo2' style={{marginLeft: '50px'}}>Encargado: Mathew Cordero</h1>
        <h1 className='titulo2'style={{marginLeft: '60px'}}>06/04/2024</h1>
      </div>

      <div style={{ width: '700px',height: '400px', marginLeft: '20px', flexDirection: 'row', display:'flex'}}>
        <div style= {{background: 'transparent' , width: '400px',height: '400px'}}>
          <TextoCustom titulo="Pedido" fontSize="26px" lineWidth="190px"></TextoCustom>
          <TextInputSmall
            icono={faSearch}
            placeholder="Buscar" 
            type="Text" 
            />
          <Dropboxsmall nombre="Plato" lista={["Hamburguesas","Jugo de Naranja"]}></Dropboxsmall>
        </div>
        <div style= {{background: 'transparent' , width: '300px',height: '400px'}}>
          <br></br>
          <TextInputSmall
            icono={fa1}
            placeholder="Cantidad" 
            type="number" 

            />
          <ButtonSmall name="Agregar"></ButtonSmall>
        </div>
      </div>
      <div style={{flexDirection: 'row', display: 'flex', alignItems:'end'}}>
        <TextoCustom titulo="Total: Q.0.00" fontSize="36px" lineWidth="290px"></TextoCustom>
        <ButtonSmall name="Pagar"></ButtonSmall>
        <ButtonSmall name="Ver Pedido"></ButtonSmall>
      </div>
      

  </div>
  );
}

export default CuentaUnica