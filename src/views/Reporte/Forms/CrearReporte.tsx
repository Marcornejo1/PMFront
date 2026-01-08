import "../Reporte.css";
import { useState, useEffect } from "react";
import Button from "../../../components/buttons/Button";
import Input from "../../../components/inputs/Input";
import { useForm } from "react-hook-form";
import InputTextArea from "../../../components/inputs/InputTextArea";
import InputDateField from "../../../components/inputs/InputDateField";
import InputImageUpload from "../../../components/inputs/InputImageUpload";
import InputOptions from "../../../components/inputs/InputOptions";
import useAxiosInstance from "../../../functions/axiosInstance";
import { useNavigate } from "react-router-dom";
import HandleErrors from "../../../components/helpers/handleErrors/HandleErrors";
import WarningAgreementMessage from "../../../components/messages/warning/WarningAgreementMessage";
import Modal from "../../../components/modals/Modal";
import CorrectoMessage from "../../../components/messages/correcto/CorrectoMessage";
import { MAYUS_REG_EX, MAYUS_REG_EX_INPUT } from "../../../const/regex";
import { useAuthContext } from "../../../context/AuthContext";


interface Props {
  onCloseComponent: () => void;
  onFinalizeProcess: () => void;
}

const tipoOptions = ["Preventivo", "Correctivo", "Emergencia", "Instalación", "Inspección"];


interface FormData {
  // Información General
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

const CrearReporte = ({ onCloseComponent, onFinalizeProcess }: Props) => {
  const navigate = useNavigate();

  //Se importan variables globales
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL


  const { register, handleSubmit, setValue, getValues, watch } = useForm<FormData>({ defaultValues: { cliente: "", direccion: "", ciudad: "", encargado: "", marca: "", modelo: "", nSerie: "", tipo: "", referenciaImages: [], EnFFAB: "0", EnFFBC: "0", EnFFCA: "0", EnFNAN: "0", EnFNBN: "0", ENFNCN: "0", CorrA: "0", CorrB: "0", CorrC: "0", SalFFAB: "0", SalFFBC: "0", SalFFCA: "0", SalFNAN: "0", SalFNBN: "0", SalFNCN: "0", CorrSalidaA: "0", CorrSalidaB: "0", CorrSalidaC: "0", FrecEntr: "0", FrecSalid: "0", PorCarga: "0", TenBateria: "0", CorrBateria: "0", TempUPS: "0", ModeloBateria: "", CantBaterias: "0", AñoFabricacionBaterias: "0000", Observaciones: "", nombreRealizo: "", nombreRecibio: "", fechaRealizado: "1000/01/01", fechaRecibido: "1000/01/01" } });
  const watchTipo = watch("tipo");

  // Obtener el nombre de usuario logueado
  const { authData } = useAuthContext();

  //Estado para controlar la apertura de los mensajes
  const [openModal, setOpenModal] = useState<"form" | "warning" | "success" | "error" | "loading">("form");
  const [disabledButton, setDisabledButton] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Estado para manejar errores
  const [error, setError] = useState<string>("");
  const [warningData, setWarningData] = useState([]);

  //creamos el hook para llamar la instancia de axios
  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    setOpenModal("form");
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

    await axiosInstance.post(urlAgregarReporte, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    //Mostramos el mensaje de confirmacion y regresamos a la vista de reportes
    setOpenModal("success");
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const enviarForm = async (data: FormData) => {
    //Lógica para enviar el formulario como completado
    //Bloqueamos el boton para evitar múltiples envíos
    setDisabledButton(true);

    try {
      //Validamos datos del formulario
      const { cliente, direccion, ciudad, encargado, marca, modelo, nSerie, tipo, referenciaImages, EnFFAB, EnFFBC, EnFFCA,
        EnFNAN, EnFNBN, ENFNCN, CorrA, CorrB, CorrC, SalFFAB, SalFFBC, SalFFCA, SalFNAN, SalFNBN, SalFNCN, CorrSalidaA, CorrSalidaB, CorrSalidaC,
        FrecEntr, FrecSalid, PorCarga, TenBateria, CorrBateria, TempUPS, ModeloBateria, CantBaterias, AñoFabricacionBaterias,
        Observaciones, nombreRealizo, nombreRecibio, fechaRealizado, fechaRecibido } = data;

      //Formateamos las fechas
      let fechaRealizadoFormat = formatDate(fechaRealizado);
      let fechaRecibidoFormat = formatDate(fechaRecibido);

      //Validamos que no esten vacíos los campos obligatorios
      if (!cliente || !direccion || !ciudad || !encargado || !marca || !modelo || !nSerie || !tipo || !FrecEntr || !FrecSalid || !PorCarga || !TenBateria || !CorrBateria || !TempUPS || !ModeloBateria || !CantBaterias || !AñoFabricacionBaterias)
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
        //Si el estatus es correcto, hacemos la solicitud para enviar los datos
        const urlAgregarReporte = `${VITE_BACKEND_URL}/api/reportes`;

        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        formData.append('estado', 'Completado');
        formData.append('usuarioCreador', authData.username);

        // Agregar archivos si los hay
        if (referenciaImages && referenciaImages.length > 0) {
          referenciaImages.forEach((file: File) => {
            formData.append('referenciaImages', file);
          });
        }

        await axiosInstance.post(urlAgregarReporte, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        //Mostramos el mensaje de confirmacion y regresamos a la vista de reportes
        setOpenModal("success");

      }


    } catch (error: any) {
      setError(error);
      setOpenModal("error");
      console.error("Error al enviar el formulario:", error);

    }

  };


  //Función para crear el reporte a pesar de las coincidencias
  const createReporte = async () => {
    //Si el estatus es correcto, hacemos la solicitud para enviar los datos
    const urlAgregarReporte = `${VITE_BACKEND_URL}/api/reportes`;
    const data = getValues();

    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('estado', 'Completado');
    formData.append('usuarioCreador', authData.username);

    // Agregar archivos si los hay
    if (data.referenciaImages && data.referenciaImages.length > 0) {
      data.referenciaImages.forEach((file: File) => {
        formData.append('referenciaImages', file);
      });
    }

    await axiosInstance.post(urlAgregarReporte, formData, {
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

  const totalSteps = 4;

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
          <HandleErrors error={error} handleFatalError={() => { setOpenModal("form"); setDisabledButton(false); }} handleWarningError={() => { setOpenModal("form"); setDisabledButton(false); }} />
        );
      case 'warning':
        <WarningAgreementMessage data={warningData} originString={getValues("nSerie")} handleAcceptMessage={createReporte} handleCancelMessage={() => { setOpenModal("form"); setDisabledButton(false); }} />
    }
  }

  return (
    <div className="reporte-container">
      {render()}
    </div>
  )
}

export default CrearReporte;
