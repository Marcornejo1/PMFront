import { useForm } from "react-hook-form";
import Input from "../../components/inputs/Input";
import Button from "../../components/buttons/Button";
import './Login.css';
//import axios from "axios";
import { useState } from "react";
import HandleErrors from "../../components/helpers/handleErrors/HandleErrors";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../functions/axiosInstance";

interface FormData {
  username: string,
  password: string,
}

const Login = () => {
  //Importamos variables globales
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const { register, handleSubmit, setValue } = useForm<FormData>({ defaultValues: { username: "", password: "" } });

  //Estados para el manejo de errores
  const [openModal, setOpenModal] = useState<"error" | "none">("none");
  const [error, setError] = useState<string>("");

  //Estado para bloquear el botón aceptar mientras se está haciendo la llamada a la API y que no se generen múltiples registros
  const [disabledButton, setDisabledButton] = useState<boolean>(false);

  //Creamos el hook para llamar la instancia de axios
  const axiosInstance = useAxiosInstance();

  //Obtenemos la función para guardar datos en el contexto
  const { setAuthData } = useAuthContext();
  const navigate = useNavigate();

  const iniciarSesion = async (data: FormData): Promise<void> => {
    //Bloquear el botón "Aceptar" para evitar múltiples llamadas a la API
    setDisabledButton(true);

    const { username, password } = data;

    try {
      //Se valida que no este vacio el campo
      if (!username || !password)
        throw new Error("missingData");

      //Se valida el tipo de dato
      if (typeof username !== "string" || typeof password !== "string")
        throw new Error("typeError");

      //Ir a la url con las credenciales de AD
      const url = `${VITE_BACKEND_URL}/api/auth`;
      const resp = await axiosInstance.post(url, data);

      //Generamos el objeto de informacíon de sesión
      const authData = { username: resp.data.username, isAuth: true, RCURT: resp.data.RCURT, RCUAT: resp.data.RCUAT };

      //Enviar información al contexto
      setAuthData(authData);

      //Enviar información al localStorage para mantener la sesión
      localStorage.setItem("authData", JSON.stringify(authData));

      //Redirigimos al usuario
      navigate("/");
    } catch (error: any) {
      //Reiniciar los datos del formulario
      setValue("username", "");
      setValue("password", "");

      setError(error);
      setOpenModal("error");
    }
    setDisabledButton(false);
  }

  const renderModal = () => {
    switch (openModal) {
      case 'error':
        return (
          <HandleErrors error={error} handleFatalError={() => setOpenModal("none")} handleWarningError={() => setOpenModal("none")} />
        );

      case "none":
        return (
          <></>
        );
    }
  }

  return (
    <main className="login">
      <form onSubmit={handleSubmit(iniciarSesion)} className="loginForm">
        <h1>Iniciar sesión</h1>
        <Input name="username" register={register} text="Usuario" type="text" />
        <Input name="password" register={register} text="Contraseña" type="password" />
        <Button btnType="submit" className="primary" text="Aceptar" onClick={() => { }} disabled={disabledButton} />
      </form>
      {renderModal()}
    </main>
  )
}

export default Login