import '../Components/BarraLateral.css';
import '../Components/Square.css';
import { useState, useEffect } from 'react'
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
  const [cuenta, setCuenta] = useState('')
  const [loggedin, setLoggedIn] = useState(localStorage.getItem('loggedin') === 'true');

  const onclickMenu = ({ir_a}) => {
    setFormState(ir_a);
  }
  
  useEffect(() => {
    localStorage.setItem('loggedin', loggedin);
  }, [loggedin]);

  const onlogout = () => {
    setLoggedIn(false)
    window.location.reload();
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
          
          <MenuButton nombre='Encuesta' onclick={() => onclickMenu({ir_a: 'encuesta'})}/>
          <MenuButton nombre='Salir' onclick={onlogout}/>
          
      </div>
      <div className='square-box'>

        {formState === 'sesiones' && <Sesiones setFormState={setFormState} setSesionState={setSesionState}/>}
        {formState === 'mesas' && <Mesas />}
        {formState === 'platos' && <Platos />}
        {formState === 'encuesta' && <Encuesta />}
        {formState === 'cuentas' && <Cuentas sesionState={sesionState} setFormState={setFormState} setCuenta={setCuenta}/>}
        {formState === 'cuenta_unica' && <CuentaUnica cuenta={cuenta}  setFormState={setFormState}></CuentaUnica>}
        {formState === 'pedido' && <Pedido cuenta={cuenta} setFormState={setFormState}></Pedido>}
        {formState === 'cliente' && <Cliente setFormState={setFormState} cuentaid={cuenta}></Cliente>}
        {formState === 'factura' && <Factura cuenta={cuenta} setFormState={setFormState} ></Factura>}
      </div>
    </div>
  ) ;
}

export default PantallaMesero