import './Titulo1.css'
import SesionComponet from '../Components/SesionComponet';
import ButtonSmall from '../Components/ButtonSmall';
const Sesiones = () => {
  return (
    <div className='sizesquare'>
      <h1 className="titulo1">SESIONES EN CURSO</h1>
      <ul className='lista'>
        <SesionComponet nombre='Sesion 1'></SesionComponet>
        <SesionComponet nombre='Sesion 1'></SesionComponet>
     
      </ul>
      <ButtonSmall name='Agregar'></ButtonSmall>
      
    </div>
    
  );
}

export default Sesiones