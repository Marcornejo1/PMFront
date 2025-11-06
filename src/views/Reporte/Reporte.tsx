import "./Reporte.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../../components/buttons/Button";
import Input from "../../components/inputs/Input";
import { useForm } from "react-hook-form";

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

  // Mediciones Electricas
  //*Tension de entrada Fase-Fase
  tensionFaseFase: string,
  tensionFaseNeutro: string,
  corrienteEntrada: string,
  //*Tension de entrada Fase-Neutro
  tensionSalidaFaseFase: string,
  tensionSalidaFaseNeutro: string,
  corrienteSalida: string,
   //*Tension de entrada Fase-Fase
  frecuenciaEntrada: string,
  frecuenciaSalida: string,
  porcentajeCarga: string,

  // Observaciones y Evaluación
  descripcionFalla: string;
  causaRaiz: string;
  accionCorrectiva: string;
  accionPreventiva: string;
  recomendaciones: string;
  
  // Datos de Control
  tiempoReparacion: string;
  costoRepuestos: string;
  costoManoObra: string;
  estadoFinal: string;
  fechaProximaRevision: string;
}

const Reporte = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, getValues, setValue } = useForm<FormData>();

  //Estado para controlar la apertura de los mensajes
  const [openModal, setOpenModal] = useState<"form" | "warning" | "success" | "error" | "loading">("form");

  useEffect(() => {
    setOpenModal("form");
  }, []);

  const enviarForm = async (data: FormData) => {
    //Lógica para enviar el formulario
    console.log(data);
  }


  const render = () => {
    switch (openModal) {
      case 'form':
        return (
          <form onSubmit={handleSubmit(enviarForm)} autoComplete="off">
            {/* Información General */}
            <div className="form-section">
              <h3>Información General</h3>
              <div className="form-grid">
                <Input type="text" name="numeroReporte" text="Número de Reporte" required={true} register={register} />
                <Input type="date" name="fecha" text="Fecha" required={true} register={register} />
                <Input type="text" name="area" text="Área" required={true} register={register} />
                <Input type="text" name="ubicacion" text="Ubicación" required={true} register={register} />
                <Input type="text" name="responsable" text="Responsable" required={true} register={register} />
              </div>
            </div>

            {/* Detalles Técnicos */}
            <div className="form-section">
              <h3>Detalles Técnicos</h3>
              <div className="form-grid">
                <Input type="text" name="equipoId" text="ID del Equipo" required={true} register={register} />
                <Input type="text" name="modelo" text="Modelo" required={true} register={register} />
                <Input type="text" name="serie" text="Número de Serie" required={true} register={register} />
                <Input type="number" name="horasOperacion" text="Horas de Operación" required={true} register={register} />
                <Input type="text" name="sistemaAfectado" text="Sistema Afectado" required={true} register={register} />
                <Input type="text" name="componenteAfectado" text="Componente Afectado" required={true} register={register} />
                <Input type="text" name="tipoFalla" text="Tipo de Falla" required={true} register={register} />
                <Input type="text" name="prioridad" text="Prioridad" required={true} register={register} />
              </div>
            </div>

            {/* Observaciones y Evaluación */}
            <div className="form-section">
              <h3>Observaciones y Evaluación</h3>
              <div className="form-grid">
                <Input type="textarea" name="descripcionFalla" text="Descripción de la Falla" required={true} register={register} />
                <Input type="textarea" name="causaRaiz" text="Causa Raíz" required={true} register={register} />
                <Input type="textarea" name="accionCorrectiva" text="Acción Correctiva" required={true} register={register} />
                <Input type="textarea" name="accionPreventiva" text="Acción Preventiva" required={true} register={register} />
                <Input type="textarea" name="recomendaciones" text="Recomendaciones" required={false} register={register} />
              </div>
            </div>

            {/* Datos de Control */}
            <div className="form-section">
              <h3>Datos de Control</h3>
              <div className="form-grid">
                <Input type="number" name="tiempoReparacion" text="Tiempo de Reparación (horas)" required={true} register={register} />
                <Input type="number" name="costoRepuestos" text="Costo de Repuestos" required={true} register={register} />
                <Input type="number" name="costoManoObra" text="Costo de Mano de Obra" required={true} register={register} />
                <Input type="text" name="estadoFinal" text="Estado Final" required={true} register={register} />
                <Input type="date" name="fechaProximaRevision" text="Fecha Próxima Revisión" required={true} register={register} />
              </div>
            </div>

            <Button btnType="submit" className="primary" text="Enviar Reporte" onClick={() => { }} />
          </form>
        );
      case 'loading':
        return <div>Cargando...</div>;
      case 'success':
        return <div>Éxito al enviar el formulario.</div>;
      case 'error':
        return <div>Error al enviar el formulario.</div>;
      case 'warning':
        return <div>Advertencia: Revise los datos ingresados.</div>;
    }
  }

  return (
    <div className="reporte-container">
      {render()}
    </div>
  )
}

export default Reporte;
