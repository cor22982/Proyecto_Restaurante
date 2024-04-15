import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './TextInputSmall.css'

const TextAreaSmall = ({ icono, placeholder, onChange, value }) => {
  return (
    <div className="input-box">
      <textarea
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value}
       
      />
      <FontAwesomeIcon icon={icono} className="icon" style={{ transform: 'translateX(750%)' }} />
    </div>
  );
};

export default TextAreaSmall; 
