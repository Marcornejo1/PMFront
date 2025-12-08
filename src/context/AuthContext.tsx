import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ContextType {
  authData: AuthData,
  setAuthData: React.Dispatch<React.SetStateAction<AuthData>>
  logout: () => void,
}

interface AuthData {
  username: string,
  isAuth: boolean,
  RCURT: string,
  RCUAT: string
}

const AuthContext = createContext<ContextType | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  //Importamos variables globales
  //const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  //Crear el estado global que se utilizará en el titleContext para poder cambiar el titulo en la barra de tareas
  const [authData, setAuthData] = useState<AuthData>({ username: "User", isAuth: false, RCURT: "", RCUAT: "" });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //Para manejo de errores
  // const [error, setError] = useState<string>("");
  // const [openError] = useState<boolean>(false);

  const navigate = useNavigate();

  //Función que se ejecuta al cargar el contexto y permite obtener los datos de la sesión del local storage
  const validateUser = (): void => {
    const authDataString: string = localStorage.getItem("authData") || "";

    if (authDataString) {
      const authSession: AuthData = JSON.parse(authDataString);

      const isAuth = authSession.isAuth || false;
      const RCUAT = authSession.RCUAT || "";
      const RCURT = authSession.RCURT || "";

      if (isAuth && RCUAT && RCURT)
        setAuthData(authSession);
    }

    setIsLoading(false);
  };

  //Función para cerrar sesión
  const logout = () => {
    //Enviamos la solicitud para eliminar las cookies desde el backend
    //const url = `${VITE_BACKEND_URL}/api/auth/`;
    //await axios.get(url);

    //Reiniciar datos del contexto
    setAuthData({ isAuth: false, username: "User", RCURT: "", RCUAT: "" });

    //Remover datos del local storage
    localStorage.removeItem("authData");

    //Navegar a la página de inicio de sesión
    navigate("/login");
  }

  useEffect(() => {
    validateUser();
  }, []);

  return (
    <AuthContext.Provider value={{ authData, setAuthData, logout }}>
      {/* Cargamos la información del hijo hasta que haya terminado de cargar para evitar renders innecesarios */}
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

//Exportamos el hook para hacer uso de este externamente
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("Error de contexto");

  return context;
}