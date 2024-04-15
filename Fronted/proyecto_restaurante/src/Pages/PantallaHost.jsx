import '../Components/BarraLateral.css';
import '../Components/Square.css';
import { useState, useEffect } from 'react'
import MenuButton from '../Components/MenuButton';
import Queja from '../HostPages/Queja';
import Mas_Pedidos from '../HostPages/Mas_Pedidos';
import Horarios from '../HostPages/Horarios';
import Promedios from '../HostPages/Promedios';
import Queja_Persona from '../HostPages/Queja_Persona';
import Queja_Comida from '../HostPages/Queja_Comida';
import Eficiencia from '../HostPages/Eficiencia';
const PantallaHost = () => {
  const [formState, setFormState] = useState('mas_pedidos')

  const onclickMenu = ({ir_a}) => {
    setFormState(ir_a);
  }
  const [loggedin, setLoggedIn] = useState(localStorage.getItem('loggedin') === 'true');
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
        
        
        <MenuButton nombre='Mas_Pedidos' onclick={() => onclickMenu({ir_a: 'mas_pedidos'})}/>
        <MenuButton nombre='Horarios' onclick={() => onclickMenu({ir_a: 'horarios'})}/>
        <MenuButton nombre='Promedios' onclick={() => onclickMenu({ir_a: 'promedios'})}/>
        <MenuButton nombre='Queja_Persona' onclick={() => onclickMenu({ir_a: 'queja_persona'})}/>
        <MenuButton nombre='Queja_Plato' onclick={() => onclickMenu({ir_a: 'queja_plato'})}/>
        <MenuButton nombre='Eficiencia' onclick={() => onclickMenu({ir_a: 'eficiencia'})}/>
        <MenuButton nombre='Queja' onclick={() => onclickMenu({ir_a: 'queja'})}/>
        <MenuButton nombre='Salir' onclick={onlogout}/>
      </div>
      <div className='square-box'>
        {formState === 'queja' && <Queja></Queja>}     
        {formState === 'mas_pedidos' && <Mas_Pedidos></Mas_Pedidos>}
        {formState === 'promedios' && <Promedios></Promedios>}
        {formState === 'horarios' && <Horarios></Horarios>}          
        {formState === 'queja_persona' && <Queja_Persona></Queja_Persona>}          
        {formState === 'queja_plato' && <Queja_Comida></Queja_Comida>}
        {formState === 'eficiencia' && <Eficiencia></Eficiencia>}                    
      </div>
    </div>
  );
}

export default PantallaHost;
