import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './TextInputSmall.css'

const TextInputSmall = ({ icono, placeholder, type,onChange,value }) => {
  return (
    <div className="input-box">
      <input 
        type={type} 
        placeholder={placeholder} required 
        onChange={({ target: { value }}) => onChange(value)}
        value={value}  
        />
      <FontAwesomeIcon icon={icono} className="icon" />
    </div>
  );
};

export default TextInputSmall;
