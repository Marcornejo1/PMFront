import { PiWarningFill } from "react-icons/pi";
import Button from "../../buttons/Button"
import Modal from "../../modals/Modal"
import "../Messages.css";
import { useState } from "react";

interface Props {
  title: string,
  handleAcceptMessage: () => void,
  handleCancelMessage: (() => void) | null,
  children: any,
}

const WarningCoincidence = ({ title, children, handleAcceptMessage, handleCancelMessage }: Props) => {
  //Bloqueo de botones para evitar registros dobles
  const [disabledButton, setDisabledButton] = useState<boolean>(false);

  const acceptMessage = () => {
    //Bloqueamos el botón independientemente de la acción para evitar múltiples registros
    setDisabledButton(true);
    handleAcceptMessage();
  }

  return (
    <Modal size="modalSmall" title={title} handleClose={handleCancelMessage || acceptMessage}>
      <div className="messageIconDiv">
        <div className="iconBackground warningBackground">
          <PiWarningFill />
        </div>
      </div>

      <p><strong>Se han encontrado coincidencias</strong></p>
      <p>¿Desea continuar?</p>

      <div className="messageButtonDiv">
        <Button btnType="button" className="primary" text="Aceptar" onClick={handleAcceptMessage} disabled={disabledButton} />
        {/* Se prepara con esta función por si solo es un mensaje informativo */}
        {handleCancelMessage && <Button btnType="button" className="secondary" text="Cancelar" onClick={handleCancelMessage} />}
      </div>

      <div className="textDiv">
        {children}
      </div>
      <div className="messageButtonDiv">
        <Button btnType="button" className="primary" text="Aceptar" onClick={acceptMessage} disabled={disabledButton} />
        {/* Se prepara con esta función por si solo es un mensaje informativo */}
        {handleCancelMessage && <Button btnType="button" className="secondary" text="Cancelar" onClick={handleCancelMessage} />}
      </div>
    </Modal>
  )
}

export default WarningCoincidence