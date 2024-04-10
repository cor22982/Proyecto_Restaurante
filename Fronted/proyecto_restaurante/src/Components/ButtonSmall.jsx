import './ButtonSmall.css'
const ButtonSmall = ({name, onclick}) => {
  return (
    <button  
      className="btn-small" type="submit"
      onClick={onclick}>{name}</button> 
  );
}
export default ButtonSmall