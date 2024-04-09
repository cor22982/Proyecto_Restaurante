import './Titulo1.css'
import TextInputSmall from '../Components/TextInputSmall';
import { faIdCard} from '@fortawesome/free-solid-svg-icons';
import TextoCustom from '../Components/TextoCustom';
import CheckboxCustom from '../Components/CheckboxCustom';
import ButtonSmall from '../Components/ButtonSmall';
const Encuesta = () => {
  return (
    <div className='sizesquare'>
      <h1 className="titulo1" style={{marginRight: '20px'}}>ENCUESTA ATENCION AL CLIENTE</h1>
      <h1 className='titulo2' style={{marginLeft: '20px'}}>Informacion</h1>
      <div style={{flexDirection: 'row', display: 'flex', alignItems: 'center'}}>
        <h2 style={{color: 'white', fontSize: '20px', marginLeft: '16px', marginRight: '10px'}}>Mesero: Mathew Cordero</h2>
        <TextInputSmall
          icono={faIdCard}
          placeholder="NIT"
          type="text"
          />
      </div>
      <TextoCustom 
        titulo="Califique la amabilidad del mesero entre 1 y 5 (1 bajo y 5 muy alto)"
        fontSize="17px"
        lineWidth="650px"></TextoCustom>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent:'center'}}>
        <CheckboxCustom name='1'></CheckboxCustom>
        <CheckboxCustom name='2'></CheckboxCustom>
        <CheckboxCustom name='3'></CheckboxCustom>
        <CheckboxCustom name='4'></CheckboxCustom>
        <CheckboxCustom name='5'></CheckboxCustom>
      </div>
      
      <TextoCustom 
        titulo="Califique la exactitud de lo recibido respecto a lo solicitado al mesero entre 1 y 5 (1 bajo y 5 muy alto)"
        fontSize="17px"
        lineWidth="700px"></TextoCustom>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent:'center'}}>
        <CheckboxCustom name='1'></CheckboxCustom>
        <CheckboxCustom name='2'></CheckboxCustom>
        <CheckboxCustom name='3'></CheckboxCustom>
        <CheckboxCustom name='4'></CheckboxCustom>
        <CheckboxCustom name='5'></CheckboxCustom>
      </div>
      <ButtonSmall name='ENTREGAR'></ButtonSmall>
    </div>
  );
}

export default Encuesta