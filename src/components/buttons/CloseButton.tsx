import './Button.css';
import { PiXCircleBold } from 'react-icons/pi';

interface Props{
  onClick: () => any,
}

const CloseButton = ({onClick}:Props) => {
  return (
    <PiXCircleBold onClick={onClick} className="actionButton" title="Cerrar" />
  )
}

export default CloseButton;