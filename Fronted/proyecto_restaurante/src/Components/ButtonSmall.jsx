import './ButtonSmall.css'
const ButtonSmall = ({name}) => {
  return (
    <button  
      className="btn-small" type="submit">{name}</button> 
  );
}
export default ButtonSmall