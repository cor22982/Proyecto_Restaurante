import React from 'react';
import './ButtonCustom.css'
const ButtonCustom = ({type,nombre}) => {
  return(
    <button type={type} className="btn">{nombre}</button>  
  );
  
}

export default ButtonCustom