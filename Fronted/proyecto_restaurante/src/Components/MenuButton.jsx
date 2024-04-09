import './MenuButton.css'
const MenuButton = ({type,nombre, onclick}) => {
  return(
    <button type={type} className="btn-outlined"
    onClick={onclick}
    >{nombre}</button>
  );
}

export default MenuButton