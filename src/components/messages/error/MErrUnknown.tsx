import "../Messages.css";
import ErrorMessage from "./ErrorMessage";

interface Props {
  handleAcceptMessage: (() => void),
}

//Aquí simplemente con el componente Message se requiere mandar las Props de icono, funciones y colocar el contenido del mensaje como html
const MErrUnknown = ({ handleAcceptMessage }: Props) => {
  return (
    <ErrorMessage title="Error" handleAcceptMessage={handleAcceptMessage}>
      <p>Error desconocido</p>
    </ErrorMessage>
  )
}

export default MErrUnknown;