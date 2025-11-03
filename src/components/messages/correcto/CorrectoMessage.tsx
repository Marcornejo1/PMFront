import { PiCheckBold } from "react-icons/pi";
import Button from "../../buttons/Button"
import Modal from "../../modals/Modal"
import "../Messages.css";

interface Props {
  handleAcceptMessage: () => void,
}

const CorrectoMessage = ({ handleAcceptMessage }: Props) => {
  return (
    <Modal size="modalSmall" title={""} handleClose={handleAcceptMessage}>
      <div className="messageIconDiv">
        <div className="iconBackground correctoBackground">
          <PiCheckBold />
        </div>
      </div>
      <div className="textDiv">
        Correcto
      </div>
      <div className="messageButtonDiv">
        <Button btnType="button" className="primary" text="Aceptar" onClick={handleAcceptMessage} />
      </div>
    </Modal>
  )
}

export default CorrectoMessage