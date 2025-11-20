import { Route, Routes } from "react-router-dom";
import Error404 from "./views/Error404/Error404";
import './App.css';
import Reporte from "./views/Reporte/Reporte";
import AppLayout from "./components/layout/AppLayout";

const App =() =>{
return(
<Routes>
    <Route element={<AppLayout />}>
    <Route path="*" element={<Error404 />} />
    <Route path="/reporte" element={<Reporte />} />
    </Route>
</Routes>
)
}

export default App;
