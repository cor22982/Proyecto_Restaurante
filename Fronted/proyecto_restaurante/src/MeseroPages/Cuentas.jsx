import './Titulo1.css'
import { useEffect,useState } from 'react'
import SesionComponet from '../Components/SesionComponet'
import ButtonSmall from '../Components/ButtonSmall'
import Dropboxsmall from '../Components/Dropboxsmall'
import TextoCustom from '../Components/TextoCustom'

const Cuentas = ({sesionState}) => {
  console.log(sesionState)
  const [cuentas, setCuentas] = useState([]);
  const getCuentas = async () => {
    const body = { }
    body.sesionid = sesionState
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(`https://cocina.web05.lol/idcuentas/${sesionState}`, fetchOptions)
    if (response.ok){
      const data = await response.json();
      setCuentas(data)
      console.log(data)
      return
    }
  }
  useEffect(() => {
    getCuentas();
  }, [])
  return (
    <div className='sizesquare'>
      <h1 className="titulo1">Sesion {sesionState}</h1>
      <ul className='lista' style={{height: '210px'}}>
        {cuentas.map ((cuenta) => (
          <SesionComponet
            key={cuenta.id}
            nombre={'Cuenta ' + cuenta.id}
            ></SesionComponet>
        ))}
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