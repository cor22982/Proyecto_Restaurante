import './Titulo1.css'
import { useEffect,useState } from 'react'
import SesionComponet from '../Components/SesionComponet'
import ButtonSmall from '../Components/ButtonSmall'
import TextInputSmall from '../Components/TextInputSmall'
import TextoCustom from '../Components/TextoCustom'
import { faTable } from '@fortawesome/free-solid-svg-icons';

const Cuentas = ({sesionState,setFormState,setCuenta}) => {
  console.log(sesionState)
  const [cuentas, setCuentas] = useState([]);
  const [dataState, setDataState] = useState({ capacidad: null,mesa: null})
  const [errorMessage, setErrorMessage] = useState('')


  const setValue = (name, value) => {
    setDataState({
      ...dataState,
      [name]: value
    })
  }

  const getCuentas = async () => {
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

  const getCapacidad = async () =>{
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(`https://cocina.web05.lol/capacytibySesion/${sesionState}`, fetchOptions)
    if (response.ok){
      const data = await response.json();
      setValue('capacidad',data[0].capacidad_sesion)
      return
    }
  }

  const clickcomponet = ({item}) => {
    setCuenta(item)
    setFormState('cuenta_unica')
  }

  useEffect(() => {
    getCuentas();
    getCapacidad ();
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

    const agregarMesa = async () => {
      const body = { mesaid: dataState.mesa,sesionid: sesionState}
      const fetchOptions = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch('https://cocina.web05.lol/insertMesa', fetchOptions);
      const data = await response.json();
      if (response.ok) {
        getCapacidad ();
        console.log('succesoninsert');
        setErrorMessage('')
        return;
      }
      setErrorMessage(data.message)
    }
  
  return (
    <div className='sizesquare'>
      <h1 className="titulo1">Sesion {sesionState}</h1>
      <ul className='lista' style={{height: '210px'}}>
        {cuentas.map ((cuenta) => (
          <SesionComponet
            key={cuenta.id}
            nombre={'Cuenta ' + cuenta.id}
            onclick={() => clickcomponet({item: cuenta.id})}
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
            type="number" 
            value={dataState.mesa}
            onChange={(value)=> setValue('mesa',value)} 
          ></TextInputSmall>
        <ButtonSmall name='Agregar' onclick={agregarMesa}></ButtonSmall>
        <TextoCustom titulo={"Capacidad: " + dataState.capacidad} fontSize="26px" lineWidth="150px"></TextoCustom>
      </div>
      {
        errorMessage !== '' ? (
          <div className='error-message' onClick={() => setErrorMessage('')}>
            {errorMessage}
          </div>
        ) : null
      }
     
      
    </div>
  );
}

export default Cuentas