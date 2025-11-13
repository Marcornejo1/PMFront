import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import './Inputs.css';

//Se obtienen las Props del componente padre. Register permite hacer uso de react hook forms
interface Props {
  name: string,
  text: string,
  required?: boolean,
  pattern?: string,
  register: UseFormRegister<any>,
  //Si está este objeto entonces sabemos que debemos convertir las letras en mayúsculas
  toUpperValue?: ToUpperValue,
}

interface ToUpperValue {
  setValue: UseFormSetValue<any>
}

const InputTextArea = ({ name, text, required, pattern, register, toUpperValue }: Props) => {
  return (
    <div className="inputRow">
      <label htmlFor={name} className="inputLabel">{text}</label>
      <textarea
        rows={4}
        id={name}
        className="field"
        autoComplete="off"
        required={required}
        pattern={pattern}
        {...register(name, {
          //Función que permite validar si está colocada la propiedad to upper para convertir el texto en mayúsculas
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            if (toUpperValue)
              toUpperValue.setValue(name, event.currentTarget.value.toUpperCase());
          },
        })} />
    </div>
  )
}

export default InputTextArea;