//Este componente obtiene la respuesta proporcionada por el backend cuando se trata de un error y realiza ciertas acciones dependiendo si es un error fatal o un warning
//Los errores de tipo warning son los que no comprometen la operación y solo requieren corrección de datos, por lo tanto no cierran el formulario o el modal sobre el que se esté trabajando
//Mientras que los errores fatales sí requieren cerrar el formulario porque son errores internos del server y comprometen la operación

import { useEffect, useState } from "react";
import MErr01 from "../../messages/error/MErr01";
import MErr02 from "../../messages/error/MErr02";
import MErrUnknown from "../../messages/error/MErrUnknown";
import MA01 from "../../messages/warning/MA01";
import MA02 from "../../messages/warning/MA02";
import { isAxiosError } from "axios";
//import { useAuthContext } from "../../../context/AuthContext";
import MA03 from "../../messages/warning/MA03";

//Las props contienen las acciones a realizar
interface Props {
  error: any,
  handleWarningError: () => void,
  handleFatalError: () => void,
}

interface ErrorFormat {
  type: string,
  message: string
}

const HandleErrors = ({ error, handleWarningError, handleFatalError }: Props) => {
  //Agregamos un estado para actualización de control de errores
  const [errorMessage, setErrorMessage] = useState("");

  //Obtener el logout del contexto por si hay error de logueo
  //const { logout } = useAuthContext();

  //Hacemos uso del estado de modales para saber cual se va a mostrar en cada momento
  const [openModal, setOpenModal] = useState<"MErr01Warning" | "MErr02Warning" | "MErr01Fatal" | "MErr01FatalLogin" | "MErr02Fatal" | "MA01" | "MA02" | "MA03" | "MErrUnknown">();

  //Función que valida si se puede parsear a JSON el error recibido (para los tipo BLOB)
  const errorToJSON = async (error: any): Promise<ErrorFormat | undefined> => {
    try {
      return JSON.parse(await error.response.data.text());
    } catch (error) {
      return undefined;
    }
  }

  useEffect(() => {
    const processErrorMessage = async () => {
      //Por si son errores manejados desde el frontend
      if (!isAxiosError(error)) {
        if (error.message === "missingData")
          return setOpenModal("MA01");

        if (error.message === "typeError" || error.message === "lengthError" || error.message === "duplicityError")
          return setOpenModal("MA02");

        if (error.message === "dateError")
          return setOpenModal("MA03");

        return setOpenModal("MErrUnknown");
      }

      //Por si el servidor no responde
      if (!error.response)
        return setOpenModal("MErr02Fatal");

      //Por si responde pero hay un error de ruta
      if (!error.response.data.type)
        return setOpenModal("MErr02Fatal");

      //El servidor responde y es error de sesión
      if (error.response.data.type === "fatal" && error.response.status === 401) {
        //Actualizamos el mensaje de error y mostramos el modal
        setErrorMessage(error.response.data.message);
        return setOpenModal("MErr01FatalLogin");
      }

      //El servidor responde y dependiendo del tipo de error
      if (error.response.data.type === "warning") {
        //Actualizamos el mensaje de error y mostramos el modal
        setErrorMessage(error.response.data.message);
        return setOpenModal("MErr01Warning");
      }

      if (error.response.data.type === "fatal") {
        //Actualizamos el mensaje de error y mostramos el modal
        setErrorMessage(error.response.data.message);
        return setOpenModal("MErr01Fatal");
      }

      //Control de errores para cuando el tipo de respuesta es BLOB
      const errorObject: ErrorFormat | undefined = await errorToJSON(error);

      if (errorObject && errorObject.type === "warning") {
        //Actualizamos el mensaje de error y mostramos el modal
        setErrorMessage(errorObject.message);
        return setOpenModal("MErr01Warning");
      }

      if (errorObject && errorObject.type === "fatal") {
        //Actualizamos el mensaje de error y mostramos el modal
        setErrorMessage(errorObject.message);
        return setOpenModal("MErr01Fatal");
      }

      //Por si ocurre algún otro error
      return setOpenModal("MErrUnknown");
    }

    processErrorMessage();
  }, []);

  const render = () => {
    switch (openModal) {
      case 'MA01':
        return <MA01 handleAcceptMessage={handleWarningError} />
      case 'MA02':
        return <MA02 handleAcceptMessage={handleWarningError} />
      case 'MA03':
        return <MA03 handleAcceptMessage={handleWarningError} />
      case 'MErr01Warning':
        return <MErr01 handleAcceptMessage={handleWarningError} errorMessage={errorMessage} />
      case 'MErr02Warning':
        return <MErr02 handleAcceptMessage={handleWarningError} />
      case 'MErr01Fatal':
        return <MErr01 handleAcceptMessage={handleFatalError} errorMessage={errorMessage} />
     // case 'MErr01FatalLogin':
       // return <MErr01 handleAcceptMessage={() => { handleFatalError(); logout() }} errorMessage={errorMessage} />
      case 'MErr02Fatal':
        return <MErr02 handleAcceptMessage={handleFatalError} />
      case 'MErrUnknown':
        return <MErrUnknown handleAcceptMessage={handleFatalError} />
    }
  }

  return (
    <>
      {render()}
    </>
  )
}

export default HandleErrors