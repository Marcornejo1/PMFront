import { useNavigate } from "react-router-dom";
import "./Error404.css";
import Button from "../../components/buttons/Button";

const Error404 = () => {
  const navigate = useNavigate();

  return(
    <main className="Error404">
      <h1 className="Error404Title">Error404</h1>
      <Button btnType="button" text="Volver al inicio" className="primary" onClick={() => navigate('/')} />
    </main>
  )
}

export default Error404;