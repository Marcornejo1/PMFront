import WarningMessage from "./WarningMessage";

interface Props {
  handleAcceptMessage: () => void,
}

const MA01 = ({ handleAcceptMessage }: Props) => {
  return (
    <>
      <WarningMessage title="Advertencia" handleAcceptMessage={handleAcceptMessage} handleCancelMessage={null}>
        <p>Faltan datos por completar</p>
      </WarningMessage>
    </>
  )
}

export default MA01