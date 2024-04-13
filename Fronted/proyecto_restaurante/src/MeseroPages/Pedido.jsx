import './Titulo1.css'
import Tabla from '../Components/Tabla';
import TextoCustom from '../Components/TextoCustom';
import ButtonSmall from '../Components/ButtonSmall';
import { useEffect,useState } from 'react';
const Pedido = ({cuenta}) => {


  const [datos, setDatos] = useState([]);
  const columnas = ['cantidad','plato','descripcion','precio','total'];
  const [precio, setPrecio] = useState(0)
  const [showBox, setShowBox] = useState(false);
  
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
        <h1 className="titulo1" style={{marginLeft: '20px'}}>Pedido {cuenta}</h1>
      </div>
      <div style={{width: '730px', height: '400px', overflowY: 'auto'}}>
        <Tabla columnas={columnas} datos={datos} />
      </div>
      
      <div style={{flexDirection: 'row', display: 'flex', alignItems:'end'}}>
        <TextoCustom titulo={"Total: Q." + precio} fontSize="36px" lineWidth="290px"></TextoCustom>
        <ButtonSmall name="Ordenar"></ButtonSmall>
      </div>
      
    </div>
  ); 
}

export default Pedido