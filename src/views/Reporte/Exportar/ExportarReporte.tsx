import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Button from '../../../components/buttons/Button';

interface ExportarReporteProps {
    children: React.ReactNode;
    fileName?: string;
    buttonText?: string;
    buttonClassName?: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

const ExportarReporte: React.FC<ExportarReporteProps> = ({
    children,
    fileName = 'reporte.pdf',
    buttonText = 'Exportar a PDF',
    buttonClassName = '',
    onSuccess,
    onError,
}) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Esperar a que todas las imágenes se carguen
    const waitForImages = async () => {
        if (!contentRef.current) return;
        const images = contentRef.current.querySelectorAll('img');
        const promises: Promise<void>[] = [];

        images.forEach((img) => {
            if (!img.complete) {
                promises.push(
                    new Promise<void>((resolve) => {
                        img.onload = () => resolve();
                        img.onerror = () => resolve();
                    })
                );
            }
        });

        await Promise.all(promises);
        // Esperar a que el DOM se renderice
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    const handleExportPDF = async () => {
        if (!contentRef.current) {
            const error = new Error('Elemento a exportar no encontrado');
            onError?.(error);
            console.error(error);
            return;
        }

        setIsLoading(true);
        try {
            // Esperar a que todas las imágenes se carguen
            await waitForImages();

            // Capturar el elemento HTML como imagen
            const canvas = await html2canvas(contentRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                backgroundColor: '#ffffff',
                ignoreElements: (element) => {
                    // No ignorar nada
                    return false;
                },
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // A4 ancho en mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            let heightLeft = imgHeight;
            let position = 0;

            // Agregar imagen a la primera página
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= 297; // Altura de página A4 en mm

            // Agregar páginas adicionales si es necesario
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= 297;
            }

            // Descargar PDF
            pdf.save(fileName);
            onSuccess?.();
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Error desconocido al exportar PDF');
            onError?.(err);
            console.error('Error exporting PDF:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '20px', marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    btnType="button"
                    text={isLoading ? 'Exportando...' : buttonText}
                    className={buttonClassName || 'primary'}
                    onClick={handleExportPDF}
                    disabled={isLoading}
                />
            </div>
            <div ref={contentRef} style={{ padding: '20px', backgroundColor: '#fff' }}>
                {children}
            </div>
        </div>
    );
};

export default ExportarReporte;