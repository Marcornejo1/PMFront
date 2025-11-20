import './Sidebar.css';


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
      </div>
    </div>
  );
};

export default Sidebar;