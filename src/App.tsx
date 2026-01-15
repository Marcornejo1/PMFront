import { Routes, Route, Navigate } from "react-router-dom";
import Error404 from "./views/Error404/Error404";
import './App.css';
import Reporte from "./views/Reporte/Reporte";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./views/Dashboard/Dashboard";
import CrearReporte from "./views/Reporte/Forms/CrearReporte";
import Login from "./views/Login/Login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoutes from "./components/guards/ProtectedRoutes";
import EditarReporte from "./views/Reporte/Forms/EditarReporte";
import InformacionReporte from "./views/Reporte/Informacion/InformacionReporte";


const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="*" element={<Error404 />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />} >
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reporte" element={<Reporte />} />
            <Route path="/crear" element={<CrearReporte onCloseComponent={function (): void { throw new Error("Function not implemented."); }} onFinalizeProcess={function (): void { throw new Error("Function not implemented."); }} />} />
            <Route path="/editar/:id" element={<EditarReporte onCloseComponent={function (): void { throw new Error("Function not implemented."); }} onFinalizeProcess={function (): void { throw new Error("Function not implemented."); }} />} />
            <Route path="/informacion/:id" element={<InformacionReporte />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App;
