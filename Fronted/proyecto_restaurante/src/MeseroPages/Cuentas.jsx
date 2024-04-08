import './Titulo1.css'
import SesionComponet from '../Components/SesionComponet'
import ButtonSmall from '../Components/ButtonSmall'
import Dropboxsmall from '../Components/Dropboxsmall'
import TextoCustom from '../Components/TextoCustom'

const Cuentas = () => {
  return (
    <div className='sizesquare'>
      <h1 className="titulo1">Cuentas Sesion 1</h1>
      <ul className='lista' style={{height: '210px'}}>
        <SesionComponet nombre='Cuenta 1'></SesionComponet>
        <SesionComponet nombre='Cuenta 1'></SesionComponet>
        <SesionComponet nombre='Cuenta 1'></SesionComponet>
      </ul>
      <ButtonSmall name='Agregar'></ButtonSmall>
      <br></br>
      <br></br>
      <TextoCustom titulo="Mesas" fontSize="36px" lineWidth="150px"></TextoCustom>
      
      <div style={{ display: 'flex',flexDirection: 'row' , alignItems: 'end'}}>
      
        <Dropboxsmall nombre="Mesas" lista={["Mesa 1 Area: Cocina","Mesa 2 Area: Cocina"]}></Dropboxsmall>
        <ButtonSmall name='Agregar'></ButtonSmall>
      </div>
     
      
    </div>
  );
}

export default Cuentas