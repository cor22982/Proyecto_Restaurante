import '../MeseroPages/Titulo1.css'
import { useEffect, useState } from 'react';
import { faIdCard, faExclamationTriangle, faUser, faBowlFood} from '@fortawesome/free-solid-svg-icons';
import TextInputSmall from '../Components/TextInputSmall';
import TextAreaSmall from '../Components/TextAreaSmall';
import TextoCustom from '../Components/TextoCustom';
import CheckboxCustom from '../Components/CheckboxCustom';
import ButtonSmall from '../Components/ButtonSmall';

const Queja = () => {
  const [data, setData] = useState({nit: '', reason: '', employee_id: '', food_id: '', rating: ''})
  const [errorMessage, setErrorMessage] = useState('')

  const setValue = (name, value) => {
    setData({
      ...data,
      [name]: value
    })
  }

  const enviarqueja = () => {
    console.table(data)
  }
  const clickcheck = (value) => {
    setValue('rating',value)  
  }
  return (
    <div className='sizesquare'>
      <h1 className="titulo1">Quejas</h1>
      <div style={{marginLeft: '20px'}}>
        <TextInputSmall
          icono={faIdCard}
          placeholder="NIT"
          type="text"
          value={data.nit}
          onChange={(value)=> setValue('nit',value)} 
        ></TextInputSmall>
      </div>
      <h2 style={{color: 'white', fontSize: '20px', marginLeft: '16px', marginRight: '10px'}}>Ingrese la razon de la queja:</h2>
      <div style={{marginLeft: '20px'}}>
        <TextAreaSmall
          icono={faExclamationTriangle}
          placeholder="Descripcion de la queja"
          type= "text"
          value={data.reason}
          onChange={(value)=> setValue('reason',value)} 
        ></TextAreaSmall>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '20px', marginTop: '40px' }}>
        <TextInputSmall
          icono={faUser}
          placeholder="Numero_Mesero"
          type="text"
          value={data.employee_id}
          onChange={(value)=> setValue('employee_id',value)} 
        />

        <div style={{marginLeft: '10px'}}>
          <TextInputSmall
            icono={faBowlFood}
            placeholder="Numero_Plato"
            type="text"
            value={data.food_id}
            onChange={(value)=> setValue('food_id',value)} 
          />
        </div>
 
        
      </div>

      <TextoCustom 
          titulo="Califique la gravedad del problema (1 problema pequeño y 5 problema muy grave)"
          fontSize="17px"
          lineWidth="650px">      
      </TextoCustom>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent:'center'}}>
        <CheckboxCustom 
            name='1'
            valor={"1"}
            accion={clickcheck} >
            </CheckboxCustom>
          <CheckboxCustom 
            name='2'
            accion={clickcheck} 
            valor={"2"}></CheckboxCustom>
          <CheckboxCustom 
            name='3'
            accion={clickcheck} 
            valor={"3"}></CheckboxCustom>
          <CheckboxCustom 
            name='4'
            accion={clickcheck} 
            valor={"4"}></CheckboxCustom>
          <CheckboxCustom 
            name='5'
            accion={clickcheck} 
            valor={"5"}></CheckboxCustom>
      </div>
      <ButtonSmall 
        name='ENTREGAR'
        onclick={enviarqueja}></ButtonSmall>
      

      
    </div>
  );
}

export default Queja