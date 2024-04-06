import React from 'react';
import './ButtonCustom.css'
const ButtonCustom = ({type,nombre,onClick}) => {
  return(
    <button type={type} className="btn"
    onClick={onClick}>{nombre}</button>  
  );
  
}

export default ButtonCustom