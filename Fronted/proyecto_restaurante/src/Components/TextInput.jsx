import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './TextInput.css';

const TextInput = ({ icono, placeholder, type }) => {
  return (
    <div className="input-box">
      <input type={type} placeholder={placeholder} required />
      <FontAwesomeIcon icon={icono} className="icon" />
    </div>
  );
};

export default TextInput;
