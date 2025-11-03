import "../Messages.css";
import ErrorMessage from "./ErrorMessage";

interface Props {
  handleAcceptMessage: (() => void),
  errorMessage: string,
}

//Aquí simplemente con el componente Message se requiere mandar las Props de icono, funciones y colocar el contenido del mensaje como html
const MErr01 = ({ handleAcceptMessage, errorMessage }: Props) => {
  return (
    <ErrorMessage title="Error" handleAcceptMessage={handleAcceptMessage}>
      <p>Ocurrió un error</p>
      <p><strong>{errorMessage}</strong></p>
    </ErrorMessage>
  )
}

export default MErr01;