import Select from "react-select";
import Style from "./SelectStyle";
import { Controller } from "react-hook-form";
import './Inputs.css';

interface OptionType {
  value: number | string;
  label: string;
}

interface Props {
  isSearchable: boolean
  name: string,
  text: string,
  required?: boolean,
  options: OptionType[],
  control: any,
  onChangeAction: ((value: number) => void) | null,
}

const InputSelect = ({ isSearchable, name, text, required = false, options, control, onChangeAction }: Props) => {
  //Esta función nos permite buscar el valor para asignarlo en el select cuando haya un cambio en del react-forms-hook
  const filterActualValue = (value: any): any => {
    const filterValue: any = options.find((option) => option.value === value);

    //Controles para el reinicio
    if (!filterValue)
      return 0;

    return filterValue;
  }

  const handleInputChange = (data: any, onChange: (value: number) => void) => {
    onChange(data.value);

    //Esta función actualizará un estado (se usa inicialmente para cuando se selecciona el botón de ver beneficiario)
    if (onChangeAction !== null)
      onChangeAction(data.value);
  }

  return (
    <div className="inputRow">
      <label htmlFor={name} className="inputLabel">{text}</label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Select
            inputId={name}
            name={name}
            options={options}
            placeholder={""}
            styles={Style}
            value={filterActualValue(value)}
            // Utilizamos la función onChange del componente select y pasamos el valor de la data al onChange del react hook form
            onChange={(data: any) => handleInputChange(data, onChange)}
            isSearchable={isSearchable}
            required={required}
          />
        )}
      />
    </div>
  )
}

export default InputSelect;