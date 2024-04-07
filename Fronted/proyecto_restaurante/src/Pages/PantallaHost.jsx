import '../Components/BarraLateral.css';
import Container from './Container';
import MenuButton from '../Components/MenuButton';
const PantallaHost = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div className="barra-lateral">
      </div>
      <Container></Container>
    </div>
  );
}

export default PantallaHost;
