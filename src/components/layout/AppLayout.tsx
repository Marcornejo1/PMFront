
import Sidebar from "../sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../navbar/Navbar";

//Aqui se engloba el contenido de las vistas y los mostramos con Outlet
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <>
      <div className="generalFrame">
        <Sidebar open={sidebarOpen} />
        <div className="mainFrame">
          <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          <div className="viewFrame">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
export default AppLayout;