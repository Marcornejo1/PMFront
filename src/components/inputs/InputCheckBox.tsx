import { UseFormRegister } from 'react-hook-form';
import { useEffect, useState } from 'react';
import './Inputs.css';

interface Props {
  register: UseFormRegister<any>,
  isChecked: boolean,
  Component?: React.FC<any>,
  componentProps?: any,
  checkBoxName: string,
  checkBoxLabel: string,
  required?: boolean,
}

const InputCheckBox = ({ register, checkBoxName, isChecked, Component, componentProps, checkBoxLabel, required }: Props) => {
  //Cada vez que aplicamos un setValue en el componente padre sí se vuelve a renderizar este componente, porque la función getValues("esTitular") es un hook de estado
  //El problema que estabamos presentando es porque estamos inicializando el estado con isChecked (que por default lo inicializamos en el front con true), 
  //pero al momento de renderizar nuevamente el componente el estado no cambia porque el componente no se desmonta
  //Esto quiere decir que el componente se renderiza nuevamente, pero recordemos que los estados se conservan.
  //Por lo tanto showCheckBox mantenía su valor con el que se inicializó y esto causaba el error entre el checkBox y el mostrar el Select
  const [showCheckBox, setShowCheckBox] = useState<boolean>();

  const toggleCheckBox = (): void => {
    setShowCheckBox(!showCheckBox);
  }

  //Al hacer este useEffect indicamos que cuando haya un cambio en la variable isChecked actualizamos el estado del showCheckbox
  //Esto nos asegura que cuando termine el fetch se actualizará la variable isChecked y se ejecutará este useEffect para actualizar el showCheckbox
  useEffect(() => {
    setShowCheckBox(isChecked);
  }, [isChecked]);

  return (
    <div className='checkBoxRow'>
      <div className='checkBoxDiv'>
        <label htmlFor={checkBoxName} className='inputLabel checkBox'>{checkBoxLabel}</label>
        <input id={checkBoxName}
          type='checkbox'
          className='field CheckboxField'
          autoComplete='off'
          required={required}
          {...register(checkBoxName, { onChange: toggleCheckBox })}
        />
      </div>
      {Component && showCheckBox && <Component {...componentProps} />}
    </div>
  )
}

export default InputCheckBox