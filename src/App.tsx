import { Navigate, Route, Routes } from "react-router-dom";
import Error404 from "./views/Error404/Error404";

const App =() =>{
return(
<Routes>
    <Route path="*" element={<Error404 />} />
</Routes>
)
}

export default App;
