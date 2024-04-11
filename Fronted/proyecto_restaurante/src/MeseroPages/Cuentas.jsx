import './Titulo1.css'
import { useEffect,useState } from 'react'
import SesionComponet from '../Components/SesionComponet'
import ButtonSmall from '../Components/ButtonSmall'
import TextInputSmall from '../Components/TextInputSmall'
import TextoCustom from '../Components/TextoCustom'
import { faTable } from '@fortawesome/free-solid-svg-icons';

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

    const handleClick = async () => {
      const body = { sesionid: sesionState }; // Aquí se corrigió el error
      const fetchOptions = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch('https://cocina.web05.lol/insertfirstcuenta', fetchOptions);
      if (response.ok) {
        getCuentas();
        console.log('succes');
        return;
      }
    };
  
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
      <ButtonSmall name='Agregar' onclick={handleClick}></ButtonSmall>
      <br></br>
      <br></br>
      <TextoCustom titulo="Mesas" fontSize="36px" lineWidth="150px"></TextoCustom>
      
      <div style={{ display: 'flex',flexDirection: 'row' , alignItems: 'center', marginLeft: '10px'}}>
      
        <TextInputSmall
            icono={faTable}
            placeholder="Numero de Mesa" 
            type="Text" 
          ></TextInputSmall>
        <ButtonSmall name='Agregar' onclick={handleClick}></ButtonSmall>
        <TextoCustom titulo="Capacidad: 0" fontSize="26px" lineWidth="150px"></TextoCustom>
      </div>
     
      
    </div>
  );
}

export default Cuentas