# InputImageUpload Component

Componente para la subida de múltiples imágenes en formularios con previsualización. Mantiene el estilo visual consistente con los demás componentes de inputs del proyecto.

## Características

- ✅ Subida de múltiples imágenes
- ✅ Previsualización de imágenes seleccionadas
- ✅ Eliminar imágenes individuales
- ✅ Límite configurable de archivos
- ✅ Validación de tipos de archivo
- ✅ Integración con React Hook Form
- ✅ Estilo consistente con otros inputs del proyecto

## Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `name` | `string` | ✅ | - | Nombre del campo para react-hook-form |
| `text` | `string` | ✅ | - | Etiqueta del campo |
| `register` | `UseFormRegister<any>` | ✅ | - | Función register de react-hook-form |
| `setValue` | `UseFormSetValue<any>` | ✅ | - | Función setValue de react-hook-form |
| `required` | `boolean` | ❌ | `false` | Si el campo es obligatorio |
| `maxFiles` | `number` | ❌ | `10` | Número máximo de imágenes permitidas |
| `acceptedFormats` | `string` | ❌ | `"image/*"` | Formatos de archivo aceptados |

## Ejemplo de Uso Básico

```tsx
import { useForm } from "react-hook-form";
import InputImageUpload from "../../components/inputs/InputImageUpload";

interface FormData {
  imagenes: File[];
  // ... otros campos
}

function MiFormulario() {
  const { register, handleSubmit, setValue } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Imágenes seleccionadas:", data.imagenes);
    
    // Enviar las imágenes al servidor
    const formData = new FormData();
    data.imagenes.forEach((file, index) => {
      formData.append(`imagen${index}`, file);
    });
    
    // fetch o axios para enviar
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputImageUpload
        name="imagenes"
        text="Fotos del Equipo"
        register={register}
        setValue={setValue}
      />
      
      <button type="submit">Enviar</button>
    </form>
  );
}
```

## Ejemplo con Validación y Límites

```tsx
import { useForm } from "react-hook-form";
import InputImageUpload from "../../components/inputs/InputImageUpload";

interface FormData {
  fotosAntes: File[];
  fotosDespues: File[];
}

function ReporteMantenimiento() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Fotos antes:", data.fotosAntes);
    console.log("Fotos después:", data.fotosDespues);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputImageUpload
        name="fotosAntes"
        text="Fotos del Estado Inicial"
        register={register}
        setValue={setValue}
        required={true}
        maxFiles={5}
        acceptedFormats="image/jpeg,image/png,image/webp"
      />

      {errors.fotosAntes && (
        <span className="error">Este campo es obligatorio</span>
      )}

      <InputImageUpload
        name="fotosDespues"
        text="Fotos del Estado Final"
        register={register}
        setValue={setValue}
        maxFiles={5}
      />

      <button type="submit">Guardar Reporte</button>
    </form>
  );
}
```

## Ejemplo de Envío al Servidor

```tsx
const onSubmit = async (data: FormData) => {
  const formData = new FormData();
  
  // Agregar otros campos del formulario
  formData.append("cliente", data.cliente);
  formData.append("direccion", data.direccion);
  
  // Agregar las imágenes
  data.imagenes.forEach((file) => {
    formData.append("imagenes", file);
  });

  try {
    const response = await fetch("https://api.ejemplo.com/reportes", {
      method: "POST",
      body: formData,
    });
    
    if (response.ok) {
      console.log("Reporte enviado exitosamente");
    }
  } catch (error) {
    console.error("Error al enviar:", error);
  }
};
```

## Ejemplo Completo con Axios

```tsx
import axios from "axios";
import { useForm } from "react-hook-form";
import InputImageUpload from "../../components/inputs/InputImageUpload";
import Input from "../../components/inputs/Input";
import Button from "../../components/buttons/Button";

interface FormData {
  titulo: string;
  descripcion: string;
  imagenes: File[];
}

function FormularioCompleto() {
  const { register, handleSubmit, setValue } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("titulo", data.titulo);
    formData.append("descripcion", data.descripcion);
    
    data.imagenes?.forEach((file) => {
      formData.append("imagenes", file);
    });

    try {
      const response = await axios.post(
        "https://api.ejemplo.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Respuesta:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        name="titulo"
        text="Título"
        register={register}
        required
      />

      <InputImageUpload
        name="imagenes"
        text="Imágenes"
        register={register}
        setValue={setValue}
        maxFiles={8}
        required
      />

      <Button text="Enviar" type="submit" />
    </form>
  );
}
```

## Estilos Personalizables

El componente utiliza las siguientes clases CSS que puedes personalizar en `Inputs.css`:

- `.imageUploadContainer` - Contenedor principal
- `.imageUploadButton` - Botón de selección
- `.imagePreviewGrid` - Grid de previsualizaciones
- `.imagePreviewItem` - Cada tarjeta de previsualización
- `.imagePreview` - La imagen previsualizada
- `.removeImageButton` - Botón de eliminar
- `.imageFileName` - Nombre del archivo

## Notas

- Las imágenes se mantienen en memoria como objetos `File` hasta que se envíen al servidor.
- El componente limpia automáticamente las previsualizaciones cuando se eliminan imágenes.
- Compatible con todos los navegadores modernos que soportan `FileReader` API.
- El límite de `maxFiles` se aplica de forma acumulativa (total de archivos seleccionados).
