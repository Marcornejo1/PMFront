import './Sidebar.css';
import { Link } from 'react-router-dom';
import { PiFileArchiveBold, PiHouseBold } from 'react-icons/pi';

//Utilizamos react-router para navegar entre las páginas, aquí colocamos las rutas
interface SidebarProps {
  open: boolean;
}

const Sidebar = ({ open }: SidebarProps) => {
  return (
    <div className={`sidebar${open ? '' : ' sidebar--hidden'}`}>
      <div className="sidebarTitle">
        <h1>Reportes</h1>
      </div>
      <div className="sidebarLinks">
        {/* Links aquí */}
        <Link to="/"><i><PiHouseBold /></i><span className='linkText'>Dashboard</span></Link>
        <Link to="/reporte"><i><PiFileArchiveBold /></i><span className='linkText'>Reportes</span></Link>
      </div>
    </div>
  );
};

export default Sidebar;