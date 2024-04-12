import './Titulo1.css'
import TextoCustom from '../Components/TextoCustom';
import ButtonSmall from '../Components/ButtonSmall';
import TextInputSmall from '../Components/TextInputSmall';
import { fa1,faBowlFood } from '@fortawesome/free-solid-svg-icons';
import { useEffect,useState } from 'react'

const CuentaUnica = ({cuenta}) => {

  const [form, setForm] =  useState({ plato: null,cantidad: null, price: null});

  const setValue = (name, value) => {
    setForm({
      ...form,
      [name]: value
    })
  }


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
      setValue('price',data[0].total)
      return
    }
  }

  useEffect(() => {
    getPrecio();
  }, [])


  return (
    <div className='sizesquare'>
      <div style={{flexDirection: 'row', display: 'flex'}}>
        <h1 className="titulo1" style={{marginLeft: '20px'}}>Cuenta {cuenta}</h1>
        
        
      </div>

      <div style={{ width: '700px',height: '400px', marginLeft: '20px', flexDirection: 'row', display:'flex'}}>
        <div style= {{background: 'transparent' , width: '400px',height: '400px'}}>
          <TextoCustom titulo="Pedido" fontSize="26px" lineWidth="190px"></TextoCustom>
          <TextInputSmall
            icono={faBowlFood}
            placeholder="Numero del plato" 
            type="Number" 
            />
          
        </div>
        <div style= {{background: 'transparent' , width: '300px',height: '400px'}}>
          <br></br>
          <TextInputSmall
            icono={fa1}
            placeholder="Cantidad" 
            type="number" 

            />
          <ButtonSmall name="Agregar"></ButtonSmall>
        </div>
      </div>
      <div style={{flexDirection: 'row', display: 'flex', alignItems:'end'}}>
        <TextoCustom titulo={'Total: Q.'+ form.price} fontSize="36px" lineWidth="290px"></TextoCustom>
        <ButtonSmall name="Pagar"></ButtonSmall>
        <ButtonSmall name="Ver Pedido"></ButtonSmall>
      </div>
      

  </div>
  );
}

export default CuentaUnica