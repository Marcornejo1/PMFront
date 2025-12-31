import WarningCoincidence from "./WarningCoincidence";

interface Props {
  data: any[],
  originString: string,
  handleAcceptMessage: () => void,
  handleCancelMessage: () => void,
}

//Aquí simplemente con el componente Message se requiere mandar las Props de icono, funciones y colocar el contenido del mensaje como html
const WarningAgreementMessage = ({ data, originString, handleAcceptMessage, handleCancelMessage }: Props) => {
  return (
    <WarningCoincidence title="Coincidencia encontrada" handleAcceptMessage={handleAcceptMessage} handleCancelMessage={handleCancelMessage}>
      <p>El acuerdo <strong>{originString}</strong> es similar a:</p>
      <ul>
        {data.map((register, index) => (
          <li key={"data" + index}>{register.acuerdo}</li>
        ))}
      </ul>
    </WarningCoincidence>
  )
}

export default WarningAgreementMessage