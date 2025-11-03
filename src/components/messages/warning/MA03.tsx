import WarningMessage from "./WarningMessage";

interface Props {
  handleAcceptMessage: () => void,
}

const MA03 = ({ handleAcceptMessage }: Props) => {
  return (
    <>
      <WarningMessage title="Advertencia" handleAcceptMessage={handleAcceptMessage} handleCancelMessage={null}>
        <p>Fechas ingresadas no válidas</p>
      </WarningMessage>
    </>
  )
}

export default MA03