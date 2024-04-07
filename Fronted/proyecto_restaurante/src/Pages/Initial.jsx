import React, { useEffect,useState } from 'react';
import PantallaBar from './PantallaBar'
import PantallaCocina from './PantallaCocina'
import PantallHost from './PantallaHost'
import PantallaMesero from './PantallaMesero'
const Initial = ({ token }) => {
  const [rol, setRol] = useState('');
  useEffect(() => {
    const sendDataToApi = async () => {
      const body = { }
      body.token = token
      const fetchOptions = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch('https://cocina.web05.lol/verified', fetchOptions)
      if (response.ok){
        const data = await response.json();
        const { rol} = data;
        setRol(rol)
        return
      }
    }

    sendDataToApi();
  }, [token]);

  let content = null;

  if (rol === 'admin') {
    
    content = <PantallHost />;
  } else if (rol === 'cheff') {
    
    content = <PantallaCocina />;
  } else if (rol === 'mesero') {
    
    content = <PantallaMesero />;
  } else if (rol === 'barista') {
    
    content = <PantallaBar />;
  } 

  return content;
}

export default Initial;
