import './Button.css'

//onClick recibe la funcion que hara el boton al presionarlo

interface Btn {
  btnType: "submit" | "reset" | "button" ,
  text: string,
  className: string,
  onClick: () => void,
  disabled?: boolean,
}

const Button = ({ btnType, text, className, onClick, disabled }: Btn) => {
  return (
    <button type={btnType} className={className === 'primary' ? 'btn btnPrimary' : 'btn btnSecondary'} onClick={onClick} disabled={disabled}>{text}</button>
  )
}

export default Button;