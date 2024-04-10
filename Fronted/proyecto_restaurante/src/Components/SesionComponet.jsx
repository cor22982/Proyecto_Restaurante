import './SesionComponet.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const SesionComponet = ({nombre,onclick}) => {
  return (
    <div className='content-component-sesion'>
      <p className='name-sesion'>{nombre}</p>
      <button className='buttonsesion' onClick={onclick}>
        <FontAwesomeIcon icon={faPen} className="icon" />
      </button>
    </div>
  );
  
}

export default SesionComponet