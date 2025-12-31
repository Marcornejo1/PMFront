import { UseFormRegister, UseFormSetValue } from "react-hook-form"
import './Inputs.css';

//Se obtienen las Props del componente padre. Register permite hacer uso de react hook forms
interface Props {
  type: string,
  name: string,
  text: string,
  min?: number,
  max?: number,
  maxLength?: number,
  minLength?: number,
  required?: boolean,
  pattern?: string,
  register: UseFormRegister<any>,
  //Si está este objeto entonces sabemos que debemos convertir las letras en mayúsculas
  toUpperValue?: ToUpperValue,
}

interface ToUpperValue {
  setValue: UseFormSetValue<any>
}

const Input = ({ type, name, text, min, max, maxLength, minLength, required, pattern, register, toUpperValue }: Props) => {
  //funcion para desactivar el scroll en los inputs de tipo number
  const handleWheel = (event: React.WheelEvent<HTMLInputElement>) => {
    const target = event.currentTarget
    if (event.currentTarget.type == "number")
      //La funcion blur quita el foco del input, desactivando el scroll
      target.blur();
  }

  return (
    <div className="inputRow">
      <label htmlFor={name} className="inputLabel">{text}</label>
      <input
        id={name}
        type={type}
        className="field"
        min={min}
        max={max}
        maxLength={maxLength}
        minLength={minLength}
        //Se indica que los caracteres deben ser convertidos a mayusculas
        pattern={pattern}
        required={required}
        autoComplete="off"
        onWheel={handleWheel}
        {...register(name, {
          onChange: toUpperValue ? (event: React.ChangeEvent<HTMLInputElement>) => {
            toUpperValue.setValue(name, event.currentTarget.value.toUpperCase());
          } : undefined,
        })}
      />
    </div>
  )
}

export default Input;