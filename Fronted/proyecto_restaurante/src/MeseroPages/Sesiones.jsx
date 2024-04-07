import './Titulo1.css'
import SesionComponet from '../Components/SesionComponet';
const Sesiones = () => {
  return (
    <div style={{width: '100%', height: '100%'}}>
      <h1 className="titulo1">SESIONES EN CURSO</h1>
      <ul style={{listStyleType: 'none', padding: 0}}>
        <SesionComponet nombre='Sesion 1'></SesionComponet>
        <SesionComponet nombre='Sesion 1'></SesionComponet>
      </ul>
      
    </div>
    
  );
}

export default Sesiones