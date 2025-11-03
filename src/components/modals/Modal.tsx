import { useEffect } from "react";
import CloseButton from "../buttons/CloseButton";
import "./Modal.css";

//Este archivo permite crear un modal con un estilo específico y dentro de él, gracias a children, podemos agregar los inputs y botones correspondientes
//El componente recibe la función handleClose para saber que hacer cuando se cierre
interface Props {
  size: "modalBig" | "modalMedium" | "modalSmall",
  title: string,
  children: any,
  handleClose: () => void
}

const Modal = ({ size, title, children, handleClose }: Props) => {
  //Bloquear scroll general cuando se monta un modal

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    }
  }, []);

  return (
    <div className="modal">
      <div className="modalBackground">
        <div className={"modalContentBackground " + size}>
          <div className="modalTitleRow">
            <h1 className="modalTitle">{title}</h1>
            <CloseButton onClick={handleClose} />
          </div>
          <div className="modalContent">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal