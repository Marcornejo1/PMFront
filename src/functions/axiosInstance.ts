//Este archivo permite crear un objeto de axios dónde podremos crear interceptores para mandar las cabeceras y configuraciones para hacer uso de ellas en las llamadas al backend
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";

//Obtenemos la información del contexto
const useAxiosInstance = () => {
  //Obtenemos los tokens del contexto
  const { authData, setAuthData } = useAuthContext();

  const axiosInstance = axios.create();

  //Este interceptor permite solo para mandar el authToken y hacer la validación en el middleware
  axiosInstance.interceptors.request.use(
    (config) => {
      const { RCUAT } = authData;
      //Actualizar el header con la respuesta solo si el header no está configurado previamente
      //Si la solicitud viene con el header configurado quiere decir que venimos de un refresh
      if (RCUAT && config.headers && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${JSON.stringify({ RCUAT })}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  //Este interceptor permite leer los códigos de respuesta y detectar cuando se tiene un estado 401 para tokens inválidos y expirados
  axiosInstance.interceptors.response.use(
    //Si se recibe una respuesta sin errores regresa la propia respuesta
    (response) => response,
    async (error) => {
      //Si el código del error es 401 (error de sesión) entonces mandamos el refreshToken para actualizar el authToken
      if (error.response?.status === 401) {
        try {
          const { RCURT } = authData;
          const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

          //Mandamos la solicitud con el refreshToken
          const response = await axios.post(`${VITE_BACKEND_URL}/api/auth/refresh`, { RCURT });

          //Guardamos el nuevo token en el estado y en el localStorage
          const newAuthData = { ...authData, ...response.data }; //Solo actualizamos los datos que se recogieron en la solicitud
          setAuthData(newAuthData);
          localStorage.setItem("authData", JSON.stringify(authData));

          //Reintentar la solicitud con el nuevo token
          error.config.headers['Authorization'] = `Bearer ${JSON.stringify({ RCUAT: newAuthData.RCUAT })}`;
          return axiosInstance.request(error.config);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      //Manejamos otro tipo de errores
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

export default useAxiosInstance;