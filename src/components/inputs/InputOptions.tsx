import { useEffect, useState } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import "./Inputs.css";

interface Option {
  value: string;
  label?: string;
}

interface Props {
  name: string;
  label: string;
  options: Option[];
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  value?: string;
  required?: boolean;
}

const InputOptions = ({ name, label, options, register, setValue, value = "", required }: Props) => {
  const [selected, setSelected] = useState<string>(value);

  useEffect(() => {
    setSelected(value || "");
  }, [value]);

  const handleSelect = (val: string) => {
    setSelected(val);
    setValue(name, val, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="tipo-selector">
      <p className="tipo-selector__label">{label}</p>
      <div className="tipo-selector__options">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`tipo-option ${selected === opt.value ? "is-active" : ""}`}
            onClick={() => handleSelect(opt.value)}
          >
            {opt.label || opt.value}
          </button>
        ))}
      </div>
      <input type="hidden" value={selected} {...register(name, { required })} />
    </div>
  );
};

export default InputOptions;
