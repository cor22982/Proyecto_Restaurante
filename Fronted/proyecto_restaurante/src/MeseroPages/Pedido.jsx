import './Titulo1.css'
import Tabla from '../Components/Tabla';
import '../Components/SesionComponet.css'
import TextoCustom from '../Components/TextoCustom';
import ButtonSmall from '../Components/ButtonSmall';
import { useEffect,useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Pedido = ({cuenta, setFormState}) => {


  const [datos, setDatos] = useState([]);
  const columnas = ['cantidad','plato','descripcion','precio','total'];
  const [precio, setPrecio] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  const getPrecio = async () =>{
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(`https://cocina.web05.lol/cuentaprecio/${cuenta}`, fetchOptions)
    if (response.ok){
      const data = await response.json();
      setPrecio(data[0].total)
      return
    }
  }

  const pedido = async () => {
    const body = { }
    body.cuentaid = cuenta
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch('https://cocina.web05.lol/insertpedido', fetchOptions)
    const data = await response.json();
    if (response.ok) {
      setErrorMessage(data.message)
      return
    }
    setErrorMessage(data.message)
  }

  const back = () =>{
    setFormState('cuenta_unica')
  }
  useEffect(()=> {
    const getPedidos = async () => {
      const fetchOptions = {
        method: 'GET',
        
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch(`https://cocina.web05.lol/getpedidos/${cuenta}`, fetchOptions)
      if (response.ok){
        const data = await response.json();
        setDatos(data);
      }
  
    }
    getPedidos()
    getPrecio()
  }, [])
  


  return (
    <div className='sizesquare'>
      <div style={{flexDirection: 'row', display: 'flex'}}>
        <button className='buttonsesion'  style={{marginLeft: '0px'}} onClick={back}>
          <FontAwesomeIcon icon={faArrowLeft} className="icon"/>
        </button>
        <h1 className="titulo1" style={{marginLeft: '20px'}}>Pedido {cuenta}</h1>
      </div>
      <div style={{width: '730px', height: '400px', overflowY: 'auto'}}>
        <Tabla columnas={columnas} datos={datos} />
      </div>
      
      <div style={{flexDirection: 'row', display: 'flex', alignItems:'end'}}>
        <TextoCustom titulo={"Total: Q." + precio} fontSize="36px" lineWidth="290px"></TextoCustom>
        <ButtonSmall name="Ordenar" onclick={pedido}></ButtonSmall>
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

export default Pedido