const TextoCustom = ({ titulo, fontSize, lineWidth }) => {
  return (
    <div style={{ flexDirection: 'column', marginLeft: '26px', marginTop: '10px', marginBottom: '2px'}}>
      <p style={{ fontFamily: 'Iner', fontSize: fontSize, color: 'white', marginBottom: '2px' }}>{titulo}</p>
      <div style={{ width: lineWidth, height: '0px', border: '1px solid #FFFFFF', marginTop: '2px' }}></div>
    </div>
  ); 
}

export default TextoCustom;

