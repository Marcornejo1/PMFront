import { useState, useRef } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import './Inputs.css';

interface Props {
  name: string;
  text: string;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  required?: boolean;
  maxFiles?: number;
  acceptedFormats?: string;
}

interface ImagePreview {
  file: File;
  preview: string;
}

const InputImageUpload = ({
  name,
  text,
  register,
  setValue,
  required = false,
  maxFiles = 10,
  acceptedFormats = "image/*"
}: Props) => {
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPreviews: ImagePreview[] = [];
    const filesArray = Array.from(files);

    // Limitar el número de archivos según maxFiles
    const filesToProcess = filesArray.slice(0, maxFiles - imagePreviews.length);

    filesToProcess.forEach((file) => {
      // Validar que sea una imagen
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push({
            file,
            preview: reader.result as string,
          });

          if (newPreviews.length === filesToProcess.length) {
            const updatedPreviews = [...imagePreviews, ...newPreviews];
            setImagePreviews(updatedPreviews);

            // Actualizar el valor en react-hook-form
            const allFiles = updatedPreviews.map(p => p.file);
            setValue(name, allFiles, { shouldValidate: true });
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);

    // Actualizar el valor en react-hook-form
    const allFiles = updatedPreviews.map(p => p.file);
    setValue(name, allFiles, { shouldValidate: true });

    // Limpiar el input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="inputRow">
      <label htmlFor={name} className="inputLabel">{text}</label>

      <div className="imageUploadContainer">
        <input
          id={name}
          type="file"
          accept={acceptedFormats}
          multiple
          style={{ display: 'none' }}
          {...register(name, {
            required,
            onChange: handleFileChange
          })}
          ref={(e) => {
            register(name).ref(e);
            (fileInputRef as any).current = e;
          }}
        />

        <button
          type="button"
          className="field imageUploadButton"
          onClick={handleClickUpload}
          disabled={imagePreviews.length >= maxFiles}
        >
          {imagePreviews.length === 0
            ? '📁 Seleccionar imágenes'
            : `📁 ${imagePreviews.length} imagen${imagePreviews.length > 1 ? 'es' : ''} seleccionada${imagePreviews.length > 1 ? 's' : ''}`
          }
          {maxFiles && ` (máx. ${maxFiles})`}
        </button>

        {imagePreviews.length > 0 && (
          <div className="imagePreviewGrid">
            {imagePreviews.map((imagePreview, index) => (
              <div key={index} className="imagePreviewItem">
                <img
                  src={imagePreview.preview}
                  alt={`Preview ${index + 1}`}
                  className="imagePreview"
                />
                <button
                  type="button"
                  className="removeImageButton"
                  onClick={() => handleRemoveImage(index)}
                  title="Eliminar imagen"
                >
                  ✕
                </button>
                <span className="imageFileName">
                  {imagePreview.file.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputImageUpload;
