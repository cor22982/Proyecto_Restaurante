import React from 'react';
import './Tabla.css';

// Tabla.jsx


const TablaBotones = ({ columnas, datos, renderBoton }) => {
  return (
    <table>
      <thead>
        <tr>
          {columnas.map((columna, index) => (
            <th key={index}>{columna}</th>
          ))}
          <th>Terminado</th>
        </tr>
      </thead>
      <tbody>
        {datos.map((fila, index) => (
          <tr key={index}>
            {columnas.map((columna, index) => (
              <td key={index}>{fila[columna]}</td>
            ))}
            <td>{renderBoton(fila)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};






export default TablaBotones;
