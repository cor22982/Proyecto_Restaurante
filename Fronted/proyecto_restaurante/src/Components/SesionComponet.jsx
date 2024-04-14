import './SesionComponet.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const SesionComponet = ({nombre,onclick, disable}) => {
  return (
    <div className='content-component-sesion'>
      <p className='name-sesion'>{nombre}</p>
      <button className='buttonsesion' onClick={onclick} disabled={disable}>
        <FontAwesomeIcon icon={faPen} className={`icon ${disable ? 'disabled-icon' : ''}`} />
      </button>
    </div>
  );
  
}

export default SesionComponet