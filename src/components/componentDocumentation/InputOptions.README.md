# InputOptions Component

## Descripción

`InputOptions` es un componente reutilizable que renderiza múltiples botones seleccionables para permitir que el usuario elija una opción de un conjunto predefinido. Está integrado con **react-hook-form** para sincronizar el valor seleccionado con el estado del formulario.

## Características

- ✅ Integración con `react-hook-form` (register, setValue, watch)
- ✅ Validación requerida configurable
- ✅ Estilos visuales para estado activo/inactivo
- ✅ Soporta etiquetas personalizadas en las opciones
- ✅ Responsivo (grid adaptable)
- ✅ Ocupa ancho completo en grids de formularios

## Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `name` | `string` | ✅ | Nombre del campo en el formulario |
| `label` | `string` | ✅ | Etiqueta visual que se muestra encima de los botones |
| `options` | `Option[]` | ✅ | Array de opciones con estructura `{ value: string; label?: string }` |
| `register` | `UseFormRegister<any>` | ✅ | Función `register` de react-hook-form |
| `setValue` | `UseFormSetValue<any>` | ✅ | Función `setValue` de react-hook-form |
| `value` | `string` | ❌ | Valor actual seleccionado (sincronizado con `watch()`) |
| `required` | `boolean` | ❌ | Define si el campo es obligatorio (default: `false`) |

## Interface Option

```typescript
interface Option {
  value: string;      // Valor que se guarda en el formulario
  label?: string;     // Texto visible en el botón (si no se proporciona, se usa value)
}
```

## Ejemplo de Uso

### Básico

```tsx
import { useForm } from "react-hook-form";
import InputOptions from "../components/inputs/InputOptions";

function MiFormulario() {
  const { register, setValue, watch } = useForm({
    defaultValues: { tipo: "" }
  });

  const watchTipo = watch("tipo");

  const tiposServicio = [
    { value: "Preventivo" },
    { value: "Correctivo" },
    { value: "Emergencia" },
    { value: "Instalación" },
    { value: "Inspección" }
  ];

  return (
    <form>
      <InputOptions
        name="tipo"
        label="Tipo de Servicio"
        options={tiposServicio}
        register={register}
        setValue={setValue}
        value={watchTipo}
        required
      />
    </form>
  );
}
```

### Con Etiquetas Personalizadas

```tsx
const opciones = [
  { value: "prev", label: "Mantenimiento Preventivo" },
  { value: "corr", label: "Mantenimiento Correctivo" },
  { value: "emerg", label: "Emergencia" }
];

<InputOptions
  name="tipoMantenimiento"
  label="Seleccionar Tipo"
  options={opciones}
  register={register}
  setValue={setValue}
  value={watchTipo}
  required
/>
```

## Estilos CSS

El componente utiliza las siguientes clases CSS definidas en `Inputs.css`:

- `.tipo-selector` - Contenedor principal
- `.tipo-selector__label` - Etiqueta del selector
- `.tipo-selector__options` - Grid de botones
- `.tipo-option` - Estilo base de cada botón
- `.tipo-option:hover` - Estilo al pasar el mouse
- `.tipo-option.is-active` - Estilo cuando está seleccionado

## Comportamiento

1. **Selección**: Al hacer click en un botón, se actualiza el estado local y se sincroniza con react-hook-form
2. **Validación**: Si `required={true}`, el campo será obligatorio en la validación del formulario
3. **Persistencia**: El valor seleccionado persiste aunque se cambie entre opciones
4. **Sincronización**: Si se usa `setValue` desde el componente padre, el selector se actualiza automáticamente

## Integración con react-hook-form

El componente se integra con react-hook-form mediante:

- `register()`: para validar el campo
- `setValue()`: para actualizar el valor cuando el usuario hace click
- `watch()`: para sincronizar la prop `value` y detectar cambios externos

## Responsive

El grid de opciones es responsive y se ajusta automáticamente:

```css
grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
```

En pantallas pequeñas, los botones se adaptan al ancho disponible.

## Notas

- El componente es obligatorio por defecto en los formularios actuales
- Usa un campo `<input hidden>` para la integración con react-hook-form
- Las opciones deben tener al menos un `value` válido
- Si no se proporciona `label` en una opción, se usa el `value` como texto visible
