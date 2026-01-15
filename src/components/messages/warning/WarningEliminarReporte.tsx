import WarningMessage from "./WarningMessage";
interface Props {
  id: string,
  handleAcceptMessage: () => void,
  handleCancelMessage: () => void,
}

const WarningEliminarReporte = ({ id, handleAcceptMessage, handleCancelMessage }: Props) => {
  return (
    <WarningMessage title="Coincidencia encontrada" handleAcceptMessage={handleAcceptMessage} handleCancelMessage={handleCancelMessage}>
      
      <p>¿Está seguro que desea eliminar el reporte con ID <strong>{id}</strong>? Esta acción no se puede deshacer.</p>

    </WarningMessage>
  )
}
export default WarningEliminarReporte;