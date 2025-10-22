import { useNavigate } from "react-router-dom";
import "./Error404.css";

const Error404 = () => {
  const navigate = useNavigate();

  return(
    <main className="Error404">
      <h1 className="Error404Title">Error404</h1>
    </main>
  )
}

export default Error404;