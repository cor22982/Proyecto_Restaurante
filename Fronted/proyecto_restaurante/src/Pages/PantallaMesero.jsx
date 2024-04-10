import '../Components/BarraLateral.css';
import '../Components/Square.css';
import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MenuButton from '../Components/MenuButton';
import Sesiones from '../MeseroPages/Sesiones';
import Cuentas from '../MeseroPages/Cuentas';
import CuentaUnica from '../MeseroPages/CuentaUnica';
import Cliente from '../MeseroPages/Cliente';
import Factura from '../MeseroPages/Factura';
import Pedido from '../MeseroPages/Pedido';
import Encuesta from '../MeseroPages/Encuesta';
import Mesas from '../MeseroPages/Mesas';
import Platos from '../MeseroPages/Platos';

const PantallaMesero = () => {
  const [formState, setFormState] = useState('sesiones')
  const [sesionState,setSesionState] = useState('')

  const onclickMenu = ({ir_a}) => {
    setFormState(ir_a);
  }
  
  
  
  return (
    <div style={{ display: 'flex' }}>
      <div className="barra-lateral">
        <MenuButton nombre='Mesero'/>
        <div style={{width: '105px' ,height: '0px', border: '1px solid #FFFFFF', marginLeft: '30px'}}></div>
          <MenuButton nombre='Inicio' onclick={() => onclickMenu({ir_a: 'sesiones'})}/>
          <MenuButton nombre='Mesas' onclick={() => onclickMenu({ir_a: 'mesas'})}/>
          <MenuButton nombre='Platos' onclick={() => onclickMenu({ir_a: 'platos'})}/>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <MenuButton nombre='Encuesta' onclick={() => onclickMenu({ir_a: 'encuesta'})}/>
          
        </div>
      <div className='square-box'>

        {formState === 'sesiones' && <Sesiones setFormState={setFormState} setSesionState={setSesionState}/>}
        {formState === 'mesas' && <Mesas />}
        {formState === 'platos' && <Platos />}
        {formState === 'encuesta' && <Encuesta />}
        {formState === 'cuentas' && <Cuentas sesionState={sesionState}/>}
       
      </div>
    </div>
  ) ;
}

export default PantallaMesero