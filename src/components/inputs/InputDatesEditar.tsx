import { UseFormRegister, UseFormSetValue } from "react-hook-form"
import InputCheckBox from "./InputCheckBox";
import Input from "./Input";

interface Props {
    register: UseFormRegister<any>,
    setValue: UseFormSetValue<any>;
}
/*          <InputDateField name={`fechaSolicitudVisita`} text="Solicitud de visita" register={register} setValue={setValue} />
            <InputDateField name={`fechaRecepcionSolicitudVisita`} text="Recepción de solicitud de visita" register={register} setValue={setValue} />
            <InputDateField name={`fechaInicioVisita`} text="Inicio de visita" register={register} setValue={setValue} />
            <InputDateField name={`fechaFinVisita`} text="Fin de visita" register={register} setValue={setValue} />
            <InputCheckBox checkBoxLabel="Incidencia visita" checkBoxName="incidenciaVisita" isChecked={false} register={register} />
*/

const InputDatesEditar = ({ register }: Props) => {
    return (
        <>
            <p><strong>Visita</strong></p>
            <Input name={`fechaSolicitudVisita`} text="Solicitud de visita" type="date" register={register} />
            <Input name={`fechaRecepcionSolicitudVisita`} text="Recepción de solicitud de visita" type="date" register={register} />
            <Input name={`fechaInicioVisita`} text="Inicio de visita" type="date" register={register} />
            <Input name={`fechaFinVisita`} text="Fin de visita" type="date" register={register} />
            <InputCheckBox checkBoxLabel="Incidencia visita" checkBoxName="incidenciaVisita" isChecked={false} register={register} />
            

        </>
    )
}
export default InputDatesEditar