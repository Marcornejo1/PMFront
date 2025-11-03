import WarningMessage from "./WarningMessage";

interface Props {
  handleAcceptMessage: () => void,
}

const MA02 = ({ handleAcceptMessage }: Props) => {
  return (
    <>
      <WarningMessage title="Advertencia" handleAcceptMessage={handleAcceptMessage} handleCancelMessage={null}>
        <p>Datos ingresados no válidos</p>
      </WarningMessage>
    </>
  )
}

export default MA02