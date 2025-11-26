import { Route, Routes } from "react-router-dom";
import Error404 from "./views/Error404/Error404";
import './App.css';
import Reporte from "./views/Reporte/Reporte";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./views/Dashboard/Dashboard";
import CrearReporte from "./views/Reporte/Forms/crearReporte";

const App =() =>{
return(
<Routes>
    <Route path="*" element={<Error404 />} />
    <Route element={<AppLayout />}>
    <Route path="/" element={<Dashboard />} />
    <Route path="/reporte" element={<Reporte />} />
    <Route path="/crear" element={<CrearReporte />} />
    </Route>
</Routes>
)
}

export default App;
