import { Route, Routes } from "react-router-dom";
import Error404 from "./views/Error404/Error404";
import './App.css';
import Reporte from "./views/Reporte/Reporte";

const App =() =>{
return(
<Routes>
    <Route path="*" element={<Error404 />} />
    <Route path="/rep" element={<Reporte />} />
</Routes>
)
}

export default App;
