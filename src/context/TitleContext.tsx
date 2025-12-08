import { createContext, useState } from "react";

interface ContextType {
  title: string,
  setTitle: (newTitle: string) => void,
}

export const TitleContext = createContext<ContextType | null>(null);

export const TitleProvider = ({ children }: any) => {
  //Crear el estado global que se utilizará en el titleContext para poder cambiar el titulo en la barra de tareas
  const [title, setTitle] = useState<string>("");

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  )
}