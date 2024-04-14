import React, { useState } from 'react';
import './CheckboxCustom.css'; // Archivo CSS con los estilos del checkbox

const CheckboxCustom = ({name, accion, valor}) => {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(!pressed); // Cambiar el estado de presionado
    if (!pressed) {
      accion(valor)
    }
  };
  return (
    <div className='contenedor'>
      <p style={{color: 'white'}}>{name}</p>
      <button
      className={pressed ? 'checkbox-custom2' : 'checkbox-custom'}
      onClick={handleClick}
      ></button>
    </div>
    

  );
}

export default CheckboxCustom;
