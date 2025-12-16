import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext"

const ProtectedRoutes = () => {
  const { authData } = useAuthContext();
  const isAuth = authData.isAuth;

  return (
    <>
      {isAuth ? <Outlet /> : <Navigate to="/login" replace />}
    </>
  )
}

export default ProtectedRoutes