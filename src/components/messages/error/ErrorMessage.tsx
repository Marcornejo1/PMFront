import { PiXBold } from "react-icons/pi";
import Button from "../../buttons/Button";
import Modal from "../../modals/Modal";
import "../Messages.css";

interface Props {
  title: string,
  handleAcceptMessage: () => void,
  children: any,
}

const ErrorMessage = ({ title, children, handleAcceptMessage }: Props) => {
  return (
    <Modal size="modalSmall" title={title} handleClose={handleAcceptMessage}>
      <div className="messageIconDiv">
        <div className="iconBackground errorBackground">
          <PiXBold />
        </div>
      </div>
      <div className="textDiv">
        {children}
      </div>
      <div className="messageButtonDiv">
        <Button btnType="button" className="primary" text="Aceptar" onClick={handleAcceptMessage} />
      </div>
    </Modal>
  )
}

export default ErrorMessage