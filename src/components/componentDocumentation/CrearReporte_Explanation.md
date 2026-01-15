# Explicación del Código: CrearReporte.tsx

Este documento explica el código del componente `CrearReporte.tsx`, que es un formulario multi-paso para crear reportes de mantenimiento en una aplicación React con TypeScript.

## Estructura General

El archivo define un componente React funcional que utiliza:
- **React Hooks**: `useState`, `useEffect`
- **React Hook Form**: Para manejo de formularios
- **Componentes personalizados**: Inputs, botones, etc.
- **Estado local**: Para navegación entre pasos y manejo de modales

## Imports (Líneas 1-10)

```tsx
import "../Reporte.css";
import { useState, useEffect } from "react";
import Button from "../../../components/buttons/Button";
import Input from "../../../components/inputs/Input";
import { useForm } from "react-hook-form";
import InputTextArea from "../../../components/inputs/InputTextArea";
import InputDateField from "../../../components/inputs/InputDateField";
import InputImageUpload from "../../../components/inputs/InputImageUpload";
import InputOptions from "../../../components/inputs/InputOptions";
```

- Importa estilos CSS específicos del módulo Reporte.
- Hooks de React para estado y efectos.
- Componentes reutilizables de la aplicación.
- Librerías externas: react-hook-form para formularios.

## Constantes (Líneas 11-12)

```tsx
const tipoOptions = ["Preventivo", "Correctivo", "Emergencia", "Instalación", "Inspección"];
```

Define opciones para el selector de tipo de servicio.

## Interfaz FormData (Líneas 14-35)

```tsx
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
  // ... (detalles de mediciones)

  // Información del Reporte
  nombreRealizo: string,
  nombreRecibio: string,
  fechaRealizado: string,
  fechaRecibido: string,
}
```

Define la estructura de datos del formulario con todos los campos requeridos.

## Componente Principal (Líneas 37-312)

### Declaración del Componente (Línea 37)

```tsx
const CrearReporte = () => {
```

Componente funcional sin props.

### Hooks y Estado (Líneas 38-44)

```tsx
const { register, handleSubmit, setValue, getValues, watch } = useForm<FormData>();
const watchTipo = watch("tipo");

//Estado para controlar la apertura de los mensajes
const [openModal, setOpenModal] = useState<"form" | "warning" | "success" | "error" | "loading">("form");
const [isSaving, setIsSaving] = useState<boolean>(false);
const [currentStep, setCurrentStep] = useState<number>(0);
```

- Configura react-hook-form con la interfaz FormData.
- Estado para modales, guardado y navegación de pasos.

### useEffect (Líneas 46-54)

```tsx
useEffect(() => {
  setOpenModal("form");
  // Cargar borrador del localStorage si existe
  const borrador = localStorage.getItem('reporteBorrador');
  if (borrador) {
    const datos = JSON.parse(borrador);
    Object.keys(datos).forEach((key) => {
      setValue(key as keyof FormData, datos[key]);
    });
  }
}, [setValue]);
```

Carga datos de borrador guardados localmente al montar el componente.

### Funciones de Manejo (Líneas 56-75)

```tsx
const guardarBorrador = () => {
  // ... lógica para guardar en localStorage
};

const nextStep = () => setCurrentStep(prev => prev + 1);
const prevStep = () => setCurrentStep(prev => prev - 1);
```

Funciones para guardar borrador y navegar entre pasos.

### Función enviarForm (Líneas 77-85)

```tsx
const enviarForm = async (data: FormData) => {
  // Lógica para enviar el formulario
  localStorage.removeItem('reporteBorrador');
};
```

Maneja el envío del formulario completado.

### Función renderStep (Líneas 87-200)

Función que retorna JSX para cada paso del formulario:

- **Paso 0**: Información General
- **Paso 1**: Mediciones de Entrada
- **Paso 2**: Mediciones de Salida
- **Paso 3**: Datos Adicionales, Observaciones, Información del Reporte, Imágenes

Cada paso renderiza secciones específicas con inputs apropiados.

### Función render (Líneas 202-312)

```tsx
const render = () => {
  switch (openModal) {
    case 'form':
      return (
        <form onSubmit={handleSubmit(enviarForm)} autoComplete="off">
          {/* Header con indicador de paso */}
          {renderStep(currentStep)}
          {/* Botones de navegación */}
        </form>
      );
    // ... otros casos para modales
  }
};
```

Maneja el renderizado basado en el estado del modal.

### Return del Componente (Líneas 310-312)

```tsx
return (
  <div className="reporte-container">
    {render()}
  </div>
);
```

Renderiza el componente principal.

## Export (Línea 314)

```tsx
export default CrearReporte;
```

Exporta el componente para uso en otros archivos.

## Características Clave

1. **Multi-paso**: Divide el formulario largo en 4 pasos manejables.
2. **Persistencia**: Guarda borradores en localStorage.
3. **Validación**: Usa react-hook-form para validación.
4. **Componentes Reutilizables**: Emplea componentes personalizados para consistencia.
5. **Responsive**: Diseño adaptable con CSS grid/flex.

## Flujo de Usuario

1. Usuario completa paso 1 (Información General).
2. Navega a pasos siguientes con "Siguiente".
3. Puede guardar borrador en cualquier momento.
4. En el último paso, envía el formulario completo.

Este componente proporciona una experiencia de usuario fluida para formularios complejos.</content>
<parameter name="filePath">c:\Users\MCORNEJO\Documents\Desarrollo\Proyecto_Mantenimiento\PMFront\src\views\Reporte\Forms\CrearReporte_Explanation.md