import '../Components/BarraLateral.css';
import '../Components/Square.css'
import MenuButton from '../Components/MenuButton';
const PantallaMesero = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div className="barra-lateral">
        <MenuButton nombre='Mesero'/>
        <div style={{width: '105px' ,height: '0px', border: '1px solid #FFFFFF', marginLeft: '30px'}}></div>
          <MenuButton nombre='Inicio'/>
          <MenuButton nombre='Mesas'/>
          <MenuButton nombre='Platos'/>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <MenuButton nombre='Encuestas'/>
        </div>
      <div className='square-box'>
        

      </div>
    </div>
  ) ;
}

export default PantallaMesero