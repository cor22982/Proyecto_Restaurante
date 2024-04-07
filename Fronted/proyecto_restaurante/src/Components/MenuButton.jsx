import './MenuButton.css'
const MenuButton = ({type,nombre}) => {
  return(
    <button type={type} className="btn-outlined"
    >{nombre}</button>
  );
}

export default MenuButton