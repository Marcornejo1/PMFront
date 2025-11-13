import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import "./Inputs.css"; // Usa los estilos ya definidos
import { es } from "date-fns/locale";

interface Props {
  name: string;
  text: string;
  required?: boolean;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
}

const InputDateField = ({ name, text, required, setValue }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Manejador de cambio de fecha
  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    setValue(name, date); // Actualiza el valor en react-hook-form
  };

  return (
    <div className="dateInputRow">
      <label htmlFor={name} className="dateInputLabel">{text}</label>
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        className="input-container" // Usa el mismo estilo de los inputs
        dateFormat="dd/MM/yyyy"
        locale={es}
        placeholderText="Selecciona una fecha"
        required={required}
        
      />
    
    </div>
  );
};

export default InputDateField;