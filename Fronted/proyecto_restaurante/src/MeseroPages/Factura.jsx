import './Titulo1.css'
import Tabla from '../Components/Tabla';
import TextoCustom from '../Components/TextoCustom';
import ButtonSmall from '../Components/ButtonSmall';
import { useEffect, useState } from 'react';
import GenerarFactura from './GenerarFactura';

const Factura = ({cuenta,setFormState}) => {
  const columnas = ['descripcion', 'cantidad', 'precio'];
  const [datos, setDatos] = useState([]);
  const [cuentadata, setCuenta] = useState({nombre: null, direccion: null, nit: null})
  const [total, setTotal] = useState(0)
  const setValue = (newData) => {
    setCuenta({
      ...cuentadata,
      ...newData
    });
  };


  const getPrecio = async () =>{
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(`https://cocina.web05.lol/cuentapreciosinpropina/${cuenta}`, fetchOptions)
    if (response.ok){
      const data = await response.json();
      console.log(data)
      setTotal(data[0].costo_sin_propina)
      return
    }
  }


  const getCliente = async () =>{
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(`https://cocina.web05.lol/clientebycuenta/${cuenta}`, fetchOptions)
    if (response.ok){
      const data = await response.json();
      console.log(data)
      setValue({
        nombre: data[0].nombre,
        direccion: data[0].direccion,
        nit: data[0].nit
      });
      return
    }
  }

  const getdatos = async () => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(`https://cocina.web05.lol/infocuenta/${cuenta}`, fetchOptions)
    if (response.ok){
      const data = await response.json();
      setDatos(data)
      return
    }
  }

  useEffect ( () => {
    getdatos()
    getCliente()
    getPrecio()
  },[]) 


  const terminarcuenta = async ()  => {
    const fetchOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(`https://cocina.web05.lol/terminarcuenta/${cuenta}`, fetchOptions)
    if (response.ok){
      const data = await response.json();
      console.log(data.message)
      return
    }
    console.log(data.message)
  }

  const handleClick = () => {
    GenerarFactura(cuenta,cuentadata,datos,total)
    terminarcuenta()
    setFormState('cuentas')
  };

  

  return (
    <div className='sizesquare'>
      <div style={{flexDirection: 'row', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
        <h1 className="titulo1" style={{marginRight: '20px'}}>FACTURA NO {cuenta}</h1>
      </div>
      <h1 className='titulo2' style={{marginLeft: '20px'}}>Informacion</h1>
      <div style={{flexDirection: 'row', display: 'flex'}}>
        <h2 style={{color: 'white', fontSize: '16px', marginLeft: '16px'}}>Nombre: {cuentadata.nombre}</h2>
        <h2 style={{color: 'white', fontSize: '16px', marginLeft: '16px'}}>Direccion: {cuentadata.direccion}</h2>
        <h2 style={{color: 'white', fontSize: '16px', marginLeft: '16px'}}>NIT: {cuentadata.nit}</h2>
      </div>
      <div style={{width: '730px', height: '350px', overflowY: 'auto'}}>
        <Tabla columnas={columnas} datos={datos} />
      </div>
      <div style={{flexDirection: 'row', display: 'flex', alignItems:'end'}}>
        <TextoCustom titulo={"Total: Q." +total} fontSize="26px" lineWidth="290px"></TextoCustom>
        <ButtonSmall 
          name="Imprimir"
          onclick={handleClick}></ButtonSmall>
      </div>
     
    </div>
    
    
  );
}

export default Factura