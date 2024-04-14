import './Titulo1.css'
import '../Components/SesionComponet.css'
import TextInputSmall from '../Components/TextInputSmall';
import Dropboxsmall from '../Components/Dropboxsmall';
import { faIdCard,faUser,faAddressBook,faMoneyBill,faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import TextoCustom from '../Components/TextoCustom';
import ButtonSmall from '../Components/ButtonSmall';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ButtonCustom from '../Components/ButtonCustom';
import { useEffect,useState } from 'react'
const Cliente = ({setFormState, cuentaid}) => {

  const [dataState, setDataState] = useState({ direccion: null,nombre: null, nit: null, cuenta: cuentaid, monto: null, forma: null})
  const [precio, setPrecio] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  

  const setValue = (name, value) => {
    setDataState({
      ...dataState,
      [name]: value
    })
  }


  const back = () =>{
    setFormState('cuenta_unica')
  }

  const gotofactura = () => {
    setFormState('factura')
  }

  const handleDropdownChange = (selectedItem) => {
    setValue('forma', selectedItem);
  }

  const getPrecio = async () =>{
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(`https://cocina.web05.lol/cuentaprecio/${cuentaid}`, fetchOptions)
    if (response.ok){
      const data = await response.json();
      setPrecio(data[0].total)
      return
    }
  }


  const pagar = async () => {
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify(dataState),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch('https://cocina.web05.lol/insertpagos', fetchOptions);
    if (response.ok) {
      const data = await response.json();
      const total = precio
      setPrecio(total - parseFloat(dataState.monto))
      setErrorMessage(data.message)
      return;
    }
    setErrorMessage(data.message)
  }
  useEffect(() => {
    getPrecio();
  }, [])

  return (
    <div className='sizesquare' style={{marginLeft: '10px'}}>
      <div style={{flexDirection: 'row', display: 'flex'}}>
        <button className='buttonsesion'  style={{marginLeft: '0px'}} onClick={back}>
          <FontAwesomeIcon icon={faArrowLeft} className="icon"/>
        </button>
        <h1 className="titulo1">DATOS CLIENTE</h1>
      </div>
      
      <div style={{ width: '700px',height: '400px',flexDirection: 'row', display:'flex'}}>
        <div style={{width: '350px',height: '400px'}}>
        <TextoCustom titulo="Datos" fontSize="26px" lineWidth="290px"></TextoCustom>
          <TextInputSmall
          icono={faIdCard}
          placeholder="NIT"
          type="text"
          value={dataState.nit}
          onChange={(value)=> setValue('nit',value)} 
          />
          <TextInputSmall
            icono={faUser}
            placeholder="Nombre"
            type="text"
            value={dataState.nombre}
            onChange={(value)=> setValue('nombre',value)} 
            />
          <TextInputSmall
            icono={faAddressBook}
            placeholder="Direccion"
            type="text"
            value={dataState.direccion}
            onChange={(value)=> setValue('direccion',value)} 
            />
        </div>
        <div style={{width: '350px',height: '400px'}}>
          <TextoCustom titulo="Pago" fontSize="26px" lineWidth="290px"></TextoCustom>
            <TextInputSmall
                icono={faMoneyBill}
                placeholder="Q0.00"
                type="text"
                value={dataState.monto}
                onChange={(value)=> setValue('monto',value)} 
                />
            <ButtonSmall 
              name = "Agregar"
              onclick={pagar}></ButtonSmall>
          <Dropboxsmall 
            nombre="Forma de Pago" 
            lista={["tarjeta","efectivo"]}
            onChange={handleDropdownChange}></Dropboxsmall>
        </div>
          
      </div>
      <div style={{width: '650px',height: '70px', flexDirection: 'row',display:'flex', alignItems: 'end'}}>
        <TextoCustom titulo={"Q."+precio} fontSize="36px" lineWidth="290px"></TextoCustom>
        <ButtonSmall 
          name="Facturar"
          onclick={gotofactura}></ButtonSmall>
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

export default Cliente