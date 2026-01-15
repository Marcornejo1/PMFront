import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import "./Inputs.css"; // Usa los estilos ya definidos
import { es } from "date-fns/locale";
import { parseISO } from "date-fns";

interface Props {
  name: string;
  text: string;
  required?: boolean;
  date?: string;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues?: (name: string) => any;
  disabled?: boolean;
}

const InputDateField = ({ name, text, required, setValue, date, disabled }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  console.log("fecha: ", date);

  //Si se proporciona la fecha, la convertimos
  useEffect(() =>{
    if (date){
      const parsedDate = parseISO(date);
      if(!isNaN(parsedDate.getTime())){
        setSelectedDate(parsedDate);
        setValue(name, parsedDate);
      }
    }
  }, [date, name, setValue]);
  
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
        disabled={disabled}
        
      />
    
    </div>
  );
};

export default InputDateField;