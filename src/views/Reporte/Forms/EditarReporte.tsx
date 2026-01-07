import "../Reporte.css";
import { useState, useEffect } from "react";
import Button from "../../../components/buttons/Button";
import { useForm } from "react-hook-form";
import useAxiosInstance from "../../../functions/axiosInstance";
import { useAuthContext } from "../../../context/AuthContext";
import { MAYUS_REG_EX, MAYUS_REG_EX_INPUT } from "../../../const/regex";
import InputDateField from "../../../components/inputs/InputDateField";
import InputImageUpload from "../../../components/inputs/InputImageUpload";
import InputOptions from "../../../components/inputs/InputOptions";
import InputTextArea from "../../../components/inputs/InputTextArea";
import Input from "../../../components/inputs/Input";
import Modal from "../../../components/modals/Modal";
import CorrectoMessage from "../../../components/messages/correcto/CorrectoMessage";
import HandleErrors from "../../../components/helpers/handleErrors/HandleErrors";
import WarningAgreementMessage from "../../../components/messages/warning/WarningAgreementMessage";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
  onCloseComponent: () => void,
  onFinalizeProcess: () => void,
}

const tipoOptions = ["Preventivo", "Correctivo", "Emergencia", "Instalación", "Inspección"];


interface FormData {
  // Información General
  idReporte: string,
  cliente: string,
  direccion: string,
  ciudad: string,
  encargado: string,
  marca: string,
  modelo: string,
  nSerie: string,
  tipo: string,
  referenciaImages: File[],

  // Mediciones Electricas
  //*Tension de entrada Fase-Fase
  EnFFAB: string,
  EnFFBC: string,
  EnFFCA: string,
  //*Tension de entrada Fase-Neutro
  EnFNAN: string,
  EnFNBN: string,
  ENFNCN: string,
  //*Corriente de entrada
  CorrA: string,
  CorrB: string,
  CorrC: string,
  //*Tension de salida Fase-Fase
  SalFFAB: string,
  SalFFBC: string,
  SalFFCA: string,
  //*Tension de salida Fase-Neutro
  SalFNAN: string,
  SalFNBN: string,
  SalFNCN: string,
  //*Corriente de salida
  CorrSalidaA: string,
  CorrSalidaB: string,
  CorrSalidaC: string,
  //*Datos separados
  FrecEntr: string,
  FrecSalid: string,
  PorCarga: string,
  TenBateria: string,
  CorrBateria: string,
  TempUPS: string,
  ModeloBateria: string,
  CantBaterias: string,
  AñoFabricacionBaterias: string,
  Observaciones: string,

  // Información del Reporte
  nombreRealizo: string,
  nombreRecibio: string,
  fechaRealizado: string,
  fechaRecibido: string,
}

const EditarReporte = ({ onCloseComponent, onFinalizeProcess }: Props) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); 
  

  //Importamos variables globales
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const { register, handleSubmit, setValue, getValues, watch } = useForm<FormData>({ defaultValues: { idReporte: "", cliente: "", direccion: "", ciudad: "", encargado: "", marca: "", modelo: "", nSerie: "", tipo: "", referenciaImages: [], EnFFAB: "0", EnFFBC: "0", EnFFCA: "0", EnFNAN: "0", EnFNBN: "0", ENFNCN: "0", CorrA: "0", CorrB: "0", CorrC: "0", SalFFAB: "0", SalFFBC: "0", SalFFCA: "0", SalFNAN: "0", SalFNBN: "0", SalFNCN: "0", CorrSalidaA: "0", CorrSalidaB: "0", CorrSalidaC: "0", FrecEntr: "0", FrecSalid: "0", PorCarga: "0", TenBateria: "0", CorrBateria: "0", TempUPS: "0", ModeloBateria: "-", CantBaterias: "0", AñoFabricacionBaterias: "0000", Observaciones: "-", nombreRealizo: "-", nombreRecibio: "-", fechaRealizado: "1000/01/01", fechaRecibido: "1000/01/01" } });
  const watchTipo = watch("tipo");

  //obtenemos datos de usuario
  const { authData } = useAuthContext();

  //Estados para mostrar el formulario o mensaje
  const [openModal, setOpenModal] = useState<"form" | "success" | "error" | "warning" | "loading">("form");

  //Estado para el manejo de errores
  const [error, setError] = useState<string>("");

  //Estado para el manejo de advertencias
  const [warningData, setWarningData] = useState<any>([]);

  //Estado para bloquear el boto de enviar para evitar multiples registros
  const [disabledButton, setDisabledButton] = useState<boolean>(false);

  //Estado para el manejo de los pasos del formulario
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);


  //Creamos el hook para la instancia de axios
  const axiosInstance = useAxiosInstance();

  //Función para obtener los datos del reporte
  const fetchData = async (): Promise<void> => {
    try {
      //Llamamos a la base de datos para obtener la informacion
      const urlGetReporteData = `${VITE_BACKEND_URL}/api/reportes/readById/${id}`;

      //Creamos el arreglo con el que obtendremos los datos
      const [reporteResponse]: any = await Promise.all([
        axiosInstance.get(urlGetReporteData),
      ]);

      console.log(reporteResponse);
      
      //Colocamos los datos en los campos del formulario
      const reporteData = reporteResponse.data;
      console.log(reporteData);

      setValue("idReporte", reporteData.id);
      setValue("cliente", reporteData.cliente);
      setValue("direccion", reporteData.direccion);
      setValue("ciudad", reporteData.ciudad);
      setValue("encargado", reporteData.encargado);
      setValue("marca", reporteData.marca);
      setValue("modelo", reporteData.modelo);
      setValue("nSerie", reporteData.nSerie);
      setValue("tipo", reporteData.tipo);
      //Las imagenes no se cargan puesto que no es posible prellenar un input file por seguridad
      setValue("EnFFAB", reporteData.mediciones?.EnFFAB || "0");
      setValue("EnFFBC", reporteData.mediciones?.EnFFBC || "0");
      setValue("EnFFCA", reporteData.mediciones?.EnFFCA || "0");
      setValue("EnFNAN", reporteData.mediciones?.EnFNAN || "0");
      setValue("EnFNBN", reporteData.mediciones?.EnFNBN || "0");
      setValue("ENFNCN", reporteData.mediciones?.ENFNCN || "0");
      setValue("CorrA", reporteData.mediciones?.CorrA || "0");
      setValue("CorrB", reporteData.mediciones?.CorrB || "0");
      setValue("CorrC", reporteData.mediciones?.CorrC || "0");
      setValue("SalFFAB", reporteData.mediciones?.SalFFAB || "0");
      setValue("SalFFBC", reporteData.mediciones?.SalFFBC || "0");
      setValue("SalFFCA", reporteData.mediciones?.SalFFCA || "0");
      setValue("SalFNAN", reporteData.mediciones?.SalFNAN || "0");
      setValue("SalFNBN", reporteData.mediciones?.SalFNBN || "0");
      setValue("SalFNCN", reporteData.mediciones?.SalFNCN || "0");
      setValue("CorrSalidaA", reporteData.mediciones?.CorrSalidaA || "0");
      setValue("CorrSalidaB", reporteData.mediciones?.CorrSalidaB || "0");
      setValue("CorrSalidaC", reporteData.mediciones?.CorrSalidaC || "0");
      // Note: FrecEntr, FrecSalid, PorCarga, TenBateria, CorrBateria, TempUPS might be in datosAdicionales or elsewhere
      setValue("FrecEntr", reporteData.datosAdicionales?.frecuenciaNominal || "0");
      setValue("FrecSalid", reporteData.datosAdicionales?.frecuenciaNominal || "0"); // Assuming same
      setValue("PorCarga", "0"); // Not in response
      setValue("TenBateria", "0"); // Not in response
      setValue("CorrBateria", "0"); // Not in response
      setValue("TempUPS", reporteData.datosAdicionales?.temperaturaAmbiente || "0");
      setValue("ModeloBateria", reporteData.modeloBateria || "-");
      setValue("CantBaterias", reporteData.cantidadBaterias?.toString() || "0");
      setValue("AñoFabricacionBaterias", reporteData.anioFabricacionBaterias?.toString() || "0000");
      setValue("Observaciones", reporteData.observaciones || "-");
      setValue("nombreRealizo", reporteData.nombreRealizo || "-");
      setValue("nombreRecibio", reporteData.nombreRecibio || "-");
      setValue("fechaRealizado", reporteData.fechaRealizo ? reporteData.fechaRealizo.split("T")[0] : "1000/01/01");
      setValue("fechaRecibido", reporteData.fechaRecibio ? reporteData.fechaRecibio.split("T")[0] : "1000/01/01");

      //Si todo sale bien, mostramos el formulario
      setOpenModal("form");
    } catch (error: any) {
      setError(error);
      setOpenModal("error");
    }
  };

  //Obtenemos los datos con useEffect y mostramos el formulario
  useEffect(() => {
    fetchData();
  }, []);

  const guardarBorrador = async (data: FormData) => {
    setIsSaving(true);
    //Logica para guardar el formulario como borrador
    const urlAgregarReporte = `${VITE_BACKEND_URL}/api/reportes`;

    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('estado', 'Borrador');
    formData.append('usuarioCreador', authData.username);

    // Append files if any
    if (data.referenciaImages && data.referenciaImages.length > 0) {
      data.referenciaImages.forEach((file: File) => {
        formData.append('referenciaImages', file);
      });
    }

    await axiosInstance.put(urlAgregarReporte, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    //Mostramos el mensaje de confirmacion y regresamos a la vista de reportes
    setOpenModal("success");

  }

  //Aqui colocamos instrucciones para poder cambiar de paso
  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const totalSteps = 4;


  //Se hace uso de react forms para el envio del formulario
  const enviarForm = async (data: FormData) => {
    //Bloqueamos el boton para evitar múltiples envíos
    setDisabledButton(true);

    try {
      //validamos datos del formulario
      const { idReporte, cliente, direccion, ciudad, encargado, marca, modelo, nSerie, tipo, referenciaImages, EnFFAB, EnFFBC, EnFFCA,
        EnFNAN, EnFNBN, ENFNCN, CorrA, CorrB, CorrC, SalFFAB, SalFFBC, SalFFCA, SalFNAN, SalFNBN, SalFNCN, CorrSalidaA, CorrSalidaB, CorrSalidaC,
        FrecEntr, FrecSalid, PorCarga, TenBateria, CorrBateria, TempUPS, ModeloBateria, CantBaterias, AñoFabricacionBaterias,
        Observaciones, nombreRealizo, nombreRecibio, fechaRealizado, fechaRecibido } = data;

      //damos formato a las fechas
      //Formateamos las fechas
      let fechaRealizadoFormat = formatDate(fechaRealizado);
      let fechaRecibidoFormat = formatDate(fechaRecibido);

      //Validamos que no esten vacíos los campos obligatorios
      if (!idReporte || !cliente || !direccion || !ciudad || !encargado || !marca || !modelo || !nSerie || !tipo || !FrecEntr || !FrecSalid || !PorCarga || !TenBateria || !CorrBateria || !TempUPS || !ModeloBateria || !CantBaterias || !AñoFabricacionBaterias)
        throw new Error("missingData");

      //Validamos los tipos de datos
      if (typeof cliente !== 'string' || typeof direccion !== 'string' || typeof ciudad !== 'string' || typeof encargado !== 'string'
        || typeof marca !== 'string' || typeof modelo !== 'string' || typeof nSerie !== 'string' || typeof tipo !== 'string' || !Array.isArray(referenciaImages)
        || typeof FrecEntr !== 'string' || typeof FrecSalid !== 'string' || typeof PorCarga !== 'string' || typeof TenBateria !== 'string'
        || typeof CorrBateria !== 'string' || typeof TempUPS !== 'string' || typeof ModeloBateria !== 'string' || typeof CantBaterias !== 'string'
        || typeof AñoFabricacionBaterias !== 'string' || typeof Observaciones !== 'string' || typeof nombreRealizo !== 'string' || typeof nombreRecibio !== 'string'
        || typeof fechaRealizadoFormat !== 'string' || typeof fechaRecibidoFormat !== 'string' || typeof EnFFAB !== 'string' || typeof EnFFBC !== 'string' || typeof EnFFCA !== 'string'
        || typeof EnFNAN !== 'string' || typeof EnFNBN !== 'string' || typeof ENFNCN !== 'string' || typeof CorrA !== 'string' || typeof CorrB !== 'string'
        || typeof CorrC !== 'string' || typeof SalFFAB !== 'string' || typeof SalFFBC !== 'string' || typeof SalFFCA !== 'string' || typeof SalFNAN !== 'string'
        || typeof SalFNBN !== 'string' || typeof SalFNCN !== 'string' || typeof CorrSalidaA !== 'string' || typeof CorrSalidaB !== 'string' || typeof CorrSalidaC !== 'string') {
        console.log("Error de tipo");
        throw new Error("typeError");
      }

      //Validamos que el número de serie cumpla las expresiones regulares
      if (!MAYUS_REG_EX.test(nSerie)) {
        throw new Error("typeError");
        console.log("error en serie");
      }
      //Enviamos solicitud para encontrar coincidencias con el mismo número de serie
      const urlFindMatch = `${VITE_BACKEND_URL}/api/reportes/findMatch?numeroSerie=${nSerie}`;
      const responseFindMatch = await axiosInstance.get(urlFindMatch);
      console.log(responseFindMatch);

      //Se revisa el status de la busqueda
      if (responseFindMatch.status === 202) {
        //Quiere decir que hay coincidencia
        setWarningData(responseFindMatch.data);
        setOpenModal("warning");
      } else {
        //Si el estatus es correcto, hacemos a solicitud para enviar los datos
        const urlUpdateReporte = `${VITE_BACKEND_URL}/api/reportes/`;

        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        formData.append('estado', 'Completado');
        formData.append('usuarioCreador', authData.username);

        //Agregamos las imagenes si las hay
        if (referenciaImages && referenciaImages.length > 0) {
          referenciaImages.forEach((file: File) => {
            formData.append('referenciaImages', file);
          });
        }

        //Hacemos la solicitud para actualizar el reporte
        await axiosInstance.put(urlUpdateReporte, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        //Si todo sale bien, mostramos el mensaje de exito
        setOpenModal("success");

      }

    } catch (error: any) {
      setError(error);
      setOpenModal("error");
      console.error("Error al enviar el formulario:", error);

    }
  };

  //Funcion para crear el reporte a pesar de las coincidencias
  const createReporte = async () => {
    //Sie el estatus es correcto, hacemos a solicitud para enviar los datos
    const urlUpdateReporte = `${VITE_BACKEND_URL}/api/reportes/`;
    const data = getValues();

    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('estado', 'Completado');
    formData.append('usuarioCreador', authData.username);

    //Agregamos las imagenes si las hay
    // Agregar archivos si los hay
    if (data.referenciaImages && data.referenciaImages.length > 0) {
      data.referenciaImages.forEach((file: File) => {
        formData.append('referenciaImages', file);
      });
    }

    await axiosInstance.post(urlUpdateReporte, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    //Mostramos el mensaje de confirmacion y regresamos a la vista de reportes
    setOpenModal("success");

  }

  //Funcion para dar formato a fechas
  const formatDate = (date: string): string => {
    if (!date) return "";

    const fecha = new Date(date);

    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0"); //Se suma 1 porque los meses van de 0 a 11
    const day = String(fecha.getDate()).padStart(2, "0"); //Obtenemos el día del mes

    return `${year}-${month}-${day}`;
  }

  //Primero renderizamos los pasos del formulario
  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="form-section">
            <h3>Información General</h3>
            <div className="form-grid">
              <Input type="text" name="cliente" text="Cliente" required={true} register={register} />
              <Input type="text" name="marca" text="Marca" required={true} register={register} />
              <Input type="text" name="direccion" text="Dirección" required={true} register={register} />
              <Input type="text" name="modelo" text="Modelo" required={true} register={register} />
              <Input type="text" name="ciudad" text="Ciudad" required={true} register={register} />
              <Input type="text" name="nSerie" text="Número de Serie" required={true} register={register} pattern={MAYUS_REG_EX_INPUT} toUpperValue={{ setValue: setValue }} />
              <Input type="text" name="encargado" text="Encargado/a" required={true} register={register} />
              <InputOptions
                name="tipo"
                label="Tipo de Servicio"
                options={tipoOptions.map((t) => ({ value: t }))}
                register={register}
                setValue={setValue}
                value={watchTipo}
                required
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="form-section">
            <h3>Mediciones de Entrada</h3>
            <div className="measurements-table">
              {/* Row: Tensión Fase-Fase */}
              <div className="measure-row-label">Tensión Fase-Fase (V)</div>
              <div className="measure-cell"><Input type="number" name="EnFFAB" text="A-B" required={false} register={register} /></div>
              <div className="measure-cell"><Input type="number" name="EnFFBC" text="B-C" required={false} register={register} /></div>
              <div className="measure-cell"><Input type="number" name="EnFFCA" text="C-A" required={false} register={register} /></div>

              {/* Row: Tensión Fase-Neutro */}
              <div className="measure-row-label">Tensión Fase-Neutro (V)</div>
              <div className="measure-cell"><Input type="number" name="EnFNAN" text="A-N" required={false} register={register} /></div>
              <div className="measure-cell"><Input type="number" name="EnFNBN" text="B-N" required={false} register={register} /></div>
              <div className="measure-cell"><Input type="number" name="ENFNCN" text="C-N" required={false} register={register} /></div>

              {/* Row: Corriente de Entrada */}
              <div className="measure-row-label">Corriente de Entrada (A)</div>
              <div className="measure-cell"><Input type="number" name="CorrA" text="Fase A" required={false} register={register} /></div>
              <div className="measure-cell"><Input type="number" name="CorrB" text="Fase B" required={false} register={register} /></div>
              <div className="measure-cell"><Input type="number" name="CorrC" text="Fase C" required={false} register={register} /></div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-section">
            <h3>Mediciones de Salida</h3>
            <div className="measurements-table">
              {/* Row: Tensión Salida Fase-Fase */}
              <div className="measure-row-label">Tensión Salida Fase-Fase (V)</div>
              <div className="measure-cell"><Input type="number" name="SalFFAB" text="A-B" required={false} register={register} /></div>
              <div className="measure-cell"><Input type="number" name="SalFFBC" text="B-C" required={false} register={register} /></div>
              <div className="measure-cell"><Input type="number" name="SalFFCA" text="C-A" required={false} register={register} /></div>

              {/* Row: Tensión Salida Fase-Neutro */}
              <div className="measure-row-label">Tensión Salida Fase-Neutro (V)</div>
              <div className="measure-cell"><Input type="number" name="SalFNAN" text="A-N" required={false} register={register} /></div>
              <div className="measure-cell"><Input type="number" name="SalFNBN" text="B-N" required={false} register={register} /></div>
              <div className="measure-cell"><Input type="number" name="SalFNCN" text="C-N" required={false} register={register} /></div>

              {/* Row: Corriente de Salida */}
              <div className="measure-row-label">Corriente de Salida (A)</div>
              <div className="measure-cell"><Input type="number" name="CorrSalidaA" text="Fase A" required={false} register={register} /></div>
              <div className="measure-cell"><Input type="number" name="CorrSalidaB" text="Fase B" required={false} register={register} /></div>
              <div className="measure-cell"><Input type="number" name="CorrSalidaC" text="Fase C" required={false} register={register} /></div>
            </div>
          </div>
        );
      case 3:
        return (
          <>
            <div className="form-section">
              <h3>Datos Adicionales</h3>
              <div className="form-grid">
                <Input type="number" name="FrecEntr" text="Frecuencia de Entrada (Hz)" required={true} register={register} />
                <Input type="number" name="FrecSalid" text="Frecuencia de Salida (Hz)" required={true} register={register} />
                <Input type="number" name="PorCarga" text="Porcentaje de Carga (%)" required={true} register={register} />
                <Input type="number" name="TenBateria" text="Tensión de la batería (V)" required={true} register={register} />
                <Input type="number" name="CorrBateria" text="Corriente de la batería (A)" required={true} register={register} />
                <Input type="text" name="ModeloBateria" text="Modelo de la batería" required={true} register={register} />
                <Input type="number" name="CantBaterias" text="Cantidad de baterías" required={true} register={register} />
                <Input type="number" name="AñoFabricacionBaterias" text="Año de fabricación de las baterías" required={true} register={register} />
                <Input type="number" name="TempUPS" text="Temperatura UPS (°C)" required={true} register={register} />
              </div>
            </div>

            <div className="form-section">
              <h3>Observaciones</h3>
              <div className="form-grid">
                <InputTextArea name="Observaciones" text="Observaciones" required={false} register={register} />
              </div>
            </div>

            <div className="form-section">
              <h3>Información del Reporte</h3>
              <div className="form-grid">
                <Input type="text" name="nombreRealizo" text="Nombre de quien realizó el reporte" required={false} register={register} />
                <Input type="text" name="nombreRecibio" text="Nombre de quien recibió el reporte" required={false} register={register} />
                <InputDateField name="fechaRealizado" text="Fecha de realizado" required={false} register={register} setValue={setValue} />
                <InputDateField name="fechaRecibido" text="Fecha de recibido" required={false} register={register} setValue={setValue} />
              </div>
            </div>

            <div className="form-section">
              <h3>Imágenes de Referencia</h3>
              <InputImageUpload name="referenciaImages" text="Fotos del Equipo" maxFiles={5} acceptedFormats="image/*" register={register} setValue={setValue} required={false} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const render = () => {
    switch (openModal) {
      case 'form':
        return (
          <form onSubmit={handleSubmit(enviarForm)} autoComplete="off">
            {/* Encabezado del documento */}
            <div className="form-header">
              <h1>Reporte de Mantenimiento</h1>
              <p>Paso {currentStep + 1} de {totalSteps}</p>
            </div>

            {renderStep(currentStep)}

            {/* Botones de acción */}
            <div className="form-actions">
              <Button
                btnType="button"
                className="secondary"
                text={isSaving ? "Guardando..." : "Guardar Borrador"}
                onClick={() => guardarBorrador(getValues())}
                disabled={isSaving}
              />
              {currentStep > 0 && (
                <Button
                  btnType="button"
                  className="secondary"
                  text="Anterior"
                  onClick={prevStep}
                />
              )}
              {currentStep < totalSteps - 1 && (
                <Button
                  btnType="button"
                  className="primary"
                  text="Siguiente"
                  onClick={nextStep}
                />
              )}{currentStep === totalSteps - 1 && (
                <Button
                  btnType="submit"
                  className="primary"
                  text="Enviar Reporte"
                  disabled={disabledButton}
                  onClick={() => { }}
                />
              )}
            </div>
          </form>
        );
      case 'loading':
        return (
          <Modal size="modalSmall" title="Agregar acuerdo" handleClose={onCloseComponent}>
            <h3>Cargando...</h3>
          </Modal>
        );
      case 'success':
        return (
          //Cuando se envíe correctamente el formulario se realiza la acción indicada (actualización, fetch, etc)
          <CorrectoMessage handleAcceptMessage={() => navigate("/reporte")} />
        );
      case 'error':
        return (
          <HandleErrors error={error} handleFatalError={() => setOpenModal("form")} handleWarningError={() => setOpenModal("form")} />
        );
      case 'warning':
        <WarningAgreementMessage data={warningData} originString={getValues("nSerie")} handleAcceptMessage={createReporte} handleCancelMessage={() => setOpenModal("form")} />
    }
  }

  return (
    <div className="reporte-container">
      {render()}
    </div>
  )

}




export default EditarReporte;