import './Titulo1.css'
import TextoCustom from '../Components/TextoCustom';
import ButtonSmall from '../Components/ButtonSmall';
import Dropboxsmall from '../Components/Dropboxsmall';
import TextInputSmall from '../Components/TextInputSmall';
import { fa1,faSearch,faBowlFood } from '@fortawesome/free-solid-svg-icons';
const CuentaUnica = ({cuenta}) => {

  return (
    <div className='sizesquare'>
      <div style={{flexDirection: 'row', display: 'flex'}}>
        <h1 className="titulo1" style={{marginLeft: '20px'}}>Cuenta {cuenta}</h1>
        
        
      </div>

      <div style={{ width: '700px',height: '400px', marginLeft: '20px', flexDirection: 'row', display:'flex'}}>
        <div style= {{background: 'transparent' , width: '400px',height: '400px'}}>
          <TextoCustom titulo="Pedido" fontSize="26px" lineWidth="190px"></TextoCustom>
          <TextInputSmall
            icono={faBowlFood}
            placeholder="Numero del plato" 
            type="Number" 
            />
          
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