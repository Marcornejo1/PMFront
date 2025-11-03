import "../Messages.css";
import ErrorMessage from "./ErrorMessage";

interface Props {
  handleAcceptMessage: () => void,
}

//Aquí simplemente con el componente Message se requiere mandar las Props de icono, funciones y colocar el contenido del mensaje como html
const MErr02 = ({ handleAcceptMessage }: Props) => {
  return (
    <ErrorMessage title="Error" handleAcceptMessage={handleAcceptMessage}>
      <p>El servidor no responde</p>
    </ErrorMessage>
  )
}

export default MErr02;