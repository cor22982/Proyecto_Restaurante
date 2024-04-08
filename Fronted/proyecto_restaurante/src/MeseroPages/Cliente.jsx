import './Titulo1.css'
import TextInputSmall from '../Components/TextInputSmall';
import Dropboxsmall from '../Components/Dropboxsmall';
import { faIdCard,faUser,faAddressBook,faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import TextoCustom from '../Components/TextoCustom';
import ButtonSmall from '../Components/ButtonSmall';
import ButtonCustom from '../Components/ButtonCustom';
const Cliente = () => {
  return (
    <div className='sizesquare' style={{marginLeft: '10px'}}>
      <h1 className="titulo1">DATOS CLIENTE</h1>
      <div style={{ width: '700px',height: '400px',flexDirection: 'row', display:'flex'}}>
        <div style={{width: '350px',height: '400px'}}>
        <TextoCustom titulo="Datos" fontSize="26px" lineWidth="290px"></TextoCustom>
          <TextInputSmall
          icono={faIdCard}
          placeholder="NIT"
          type="text"
          />
          <TextInputSmall
            icono={faUser}
            placeholder="Nombre"
            type="text"
            />
          <TextInputSmall
            icono={faAddressBook}
            placeholder="Direccion"
            type="text"
            />
        </div>
        <div style={{width: '350px',height: '400px'}}>
          <TextoCustom titulo="Pago" fontSize="26px" lineWidth="290px"></TextoCustom>
            <TextInputSmall
                icono={faMoneyBill}
                placeholder="Q0.00"
                type="text"
                />
            <ButtonSmall name = "Agregar"></ButtonSmall>
          <Dropboxsmall nombre="Forma de Pago" lista={["tarjeta","efectivo"]}></Dropboxsmall>
        </div>
          
      </div>
      <div style={{width: '650px',height: '70px', flexDirection: 'row',display:'flex', alignItems: 'end'}}>
        <TextoCustom titulo="Q.0.00" fontSize="36px" lineWidth="290px"></TextoCustom>
        <ButtonSmall name="Facturar"></ButtonSmall>
      </div>


    </div>
  );
}

export default Cliente