import { PiUserCircleFill, PiList } from "react-icons/pi";
import './Nabvar.css';
import { useState, useContext } from "react";
import NavbarTooltip from "./NavbarTooltip";
import { TitleContext } from "../../context/TitleContext";

interface NavbarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Navbar = ({ toggleSidebar, sidebarOpen }: NavbarProps) => {
  //Usar contexto para obtener el título de la página dónde se encuentra
  const context = useContext(TitleContext);

  //Hook para mostrar o no el tooltip
  const [show, setShow] = useState<boolean>(false);

  //Funciones para mostrar o cerrar el tooltip
  const toggleShowTooltip = (): void => {
    setShow(!show);
  }

  const closeTooltip = (): void => {
    setShow(false);
  }

  return (
    <div className={`navbar ${sidebarOpen ? '' : 'navbar--fullwidth'}`}>
      <button className="sidebarToggleButton" onClick={toggleSidebar} aria-label={sidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}>
        <PiList />
      </button>

      <div className="navbarTitle">
        <h1>{context?.title}</h1>
      </div>

      <div className="profileButton" onClick={toggleShowTooltip}>
        <PiUserCircleFill />
      </div>
      {show && <NavbarTooltip closeTooltip={closeTooltip} />}
    </div>
  )
}

export default Navbar