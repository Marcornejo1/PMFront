import "../Reporte.css";
import { useState, useEffect } from "react";
import Button from "../../../components/buttons/Button";
import Input from "../../../components/inputs/Input";
import { useForm } from "react-hook-form";
import InputTextArea from "../../../components/inputs/InputTextArea";
import InputImageUpload from "../../../components/inputs/InputImageUpload";

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

}

const CrearReporte = () => {
  const { register, handleSubmit, setValue } = useForm<FormData>();

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
            {/* Encabezado del documento */}
            <div className="form-header">
              <h1>Reporte de Mantenimiento</h1>
            </div>

            {/* Información General */}
            <div className="form-section">
              <h3>Información General</h3>
              <div className="form-grid">
                <Input type="text" name="cliente" text="Cliente" required={true} register={register} />
                <Input type="text" name="marca" text="Marca" required={true} register={register} />
                <Input type="text" name="direccion" text="Dirección" required={true} register={register} />
                <Input type="text" name="modelo" text="Modelo" required={true} register={register} />
                <Input type="text" name="ciudad" text="Ciudad" required={true} register={register} />
                <Input type="text" name="nSerie" text="Número de Serie" required={true} register={register} />
                <Input type="text" name="encargado" text="Encargado/a" required={true} register={register} />
                <Input type="text" name="tipo" text="Tipo de Servicio" required={true} register={register} />
              </div>
            </div>

            {/* Mediciones eléctricas en formato fila por sección (cada fila: 3 columnas) */}
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

            {/* Datos Separados */}
            <div className="form-section">
              <h3>Datos Adicionales</h3>
              <div className="form-grid">
                <Input type="number" name="FrecEntr" text="Frecuencia de Entrada (Hz)" required={false} register={register} />
                <Input type="number" name="FrecSalid" text="Frecuencia de Salida (Hz)" required={false} register={register} />
                <Input type="number" name="PorCarga" text="Porcentaje de Carga (%)" required={false} register={register} />
                <Input type="number" name="TenBateria" text="Tensión de la batería (V)" required={false} register={register} />
                <Input type="number" name="CorrBateria" text="Corriente de la batería (A)" required={false} register={register} />
                <Input type="text" name="ModeloBateria" text="Modelo de la batería" required={false} register={register} />
                <Input type="number" name="CantBaterias" text="Cantidad de baterías" required={false} register={register} />
                <Input type="number" name="AñoFabricacionBaterias" text="Año de fabricación de las baterías" required={false} register={register} />
                <Input type="number" name="TempUPS" text="Temperatura UPS (°C)" required={false} register={register} />
              </div>
            </div>

            {/* Observaciones */}
            <div className="form-section">
              <h3>Observaciones</h3>
              <div className="form-grid">
                <InputTextArea name="Observaciones" text="Observaciones" required={false} register={register} />
              </div>
            </div>

            {/*Imagenes de referencia*/}
            <div className="form-section">
              <h3>Imágenes de Referencia</h3>
              <InputImageUpload name="referenciaImages" text="Fotos del Equipo" maxFiles={5} acceptedFormats="image/*" register={register} setValue={setValue} required={false} />
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

export default CrearReporte;
