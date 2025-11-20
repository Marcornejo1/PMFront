import { useEffect, useRef } from "react";
import Button from "../buttons/Button";

interface Props{
  closeTooltip: () => void;
}

const NavbarTooltip = ({ closeTooltip }: Props) => {
  //Hook para guardar la referencia del tooltip y no acceder directamente al DOM
  const tooltipRef = useRef<any>(null);

  //Obtenemos el nombre de usuario del contexto
  //const { authData, logout } = useAuthContext();

  //Función para detectar cuando se hace clic fuera del tooltip y cerrarlo
  const handleClickOutside = (event: any) => {
    if (!tooltipRef.current.contains(event.target))
      closeTooltip();
  }

  //Cargar use effect para conocer cuando se hace clic sobre el documento general
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return (() => {
      document.removeEventListener("mousedown", handleClickOutside);
    });
  }, []);

  return (
    <div ref={tooltipRef} className="navbarTooltip">
      <div className="tooltipTriangle"></div>
      <div className="tooltipContent">
        <div>{/*authData.username*/}</div>
        <Button btnType="button" className="primary" text="Cerrar sesión" onClick={() => {}} />
      </div>
    </div >
  )
}

export default NavbarTooltip