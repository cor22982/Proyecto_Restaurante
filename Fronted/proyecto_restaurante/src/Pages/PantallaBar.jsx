import '../Components/BarraLateral.css'
import '../Components/Square.css';
import MenuButton from '../Components/MenuButton';
import { useState, useEffect } from 'react'
import Bar from '../BarPages/Bar';

const PantallaBar = () => {
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
        <MenuButton nombre='Barista'/>
        <div style={{width: '105px' ,height: '0px', border: '1px solid #FFFFFF', marginLeft: '30px'}}></div>
        <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <MenuButton nombre='Salir' onclick={onlogout}/>
      </div>
      <div className='square-box'>
        <Bar></Bar>
      </div>
      
    </div>
    
  ) ;
}

export default PantallaBar