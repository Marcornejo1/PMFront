import { useEffect, useState } from "react";
import WarningMessage from "./WarningMessage";
import useAxiosInstance from "../../../functions/axiosInstance";
import Modal from "../../modals/Modal";
import HandleErrors from "../../helpers/handleErrors/HandleErrors";
import CorrectoMessage from "../correcto/CorrectoMessage";

interface Props {
  id: string,
  onCloseComponent: () => void,
  onFinalizeProcess: () => void,
}

const WarningEliminarReporte = ({ id, onCloseComponent, onFinalizeProcess }: Props) => {
  //Importamos variables globales
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [tituloReporte, setTituloReporte] = useState<string>("");
  const [openModal, setOpenModal] = useState<"borrarModal" | "loading" | "error" | "success">("loading");
  //Estado de control de errores
  const [error, setError] = useState<any>();

  //Creamos el hook para llamar la instancia de axios
  const axiosInstance = useAxiosInstance();

  //Acciones para eliminar el reporte
  //Proceso para obtener datos
  const fetchData = async (): Promise<void> => {
    const urlGetReporteData = `${VITE_BACKEND_URL}/reportes/${id}`;

    try {
      //Validamos que se encuentre el id
      if (!id)
        throw new Error("missingData");

      //Validamos que se cumpla el tipo de dato
      if (typeof id !== "string")
        throw new Error("typeError");

      const response = await axiosInstance.get(urlGetReporteData);
      setTituloReporte(response.data.cliente);
      setOpenModal("borrarModal");
    } catch (error: any) {
      setError(error);
      setOpenModal("error");
    }
  }

  const eliminarReporte = async (idReporte: string): Promise<void> => {
    //Proceso para eliminar el reporte
    const urlDeleteReporte = `${VITE_BACKEND_URL}/reportes/${idReporte}`;

    try {
      await axiosInstance.delete(urlDeleteReporte);
      setOpenModal("success");
    } catch (error: any) {
      setError(error);
      setOpenModal("error");
    }

  }

  useEffect(() => {
    fetchData();
  }, []);

  const render = () => {
    switch (openModal) {
      case "borrarModal":
        return (
          <WarningMessage title="Eliminar reporte" handleAcceptMessage={() => eliminarReporte(id)} handleCancelMessage={onCloseComponent} >
            <p>Se va a eliminar el reporte con id: {id}</p>
            <p>Cliente: {tituloReporte}</p>
            <p>¿Desea continuar?</p>
          </WarningMessage>
        );
          
      case "loading":
        return (
          <Modal size="modalSmall" title="Eliminar reporte" handleClose={onCloseComponent}>
            <h3>Cargando...</h3>
          </Modal>
        );

      case "error":
        return (
          <HandleErrors error={error} handleFatalError={onCloseComponent} handleWarningError={onCloseComponent} />
        );
      
      case "success":
        return(
          //Cuando se envia correctamente se realizara la accion indicada en onFinalizeProcess
          <CorrectoMessage handleAcceptMessage={() => {onFinalizeProcess(); onCloseComponent()}} />
        );
    }
  }


  return (
    <>
      {render()}
    </>
  )
}
export default WarningEliminarReporte;