import "../Reporte.css";
import "./InformacionReporte.css";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { TitleContext } from "../../../context/TitleContext";
import useAxiosInstance from "../../../functions/axiosInstance";
import HandleErrors from "../../../components/helpers/handleErrors/HandleErrors";
import ExportarReporte from "../Exportar/ExportarReporte";

interface ReporteData {
    idReporte: string;
    cliente: string;
    direccion: string;
    ciudad: string;
    encargado: string;
    tipo: string;
    estado: string;
    observaciones: string;
    nombreRealizo: string;
    nombreRecibio: string;
    usuarioCreador: string;
    fechaRealizo: string;
    fechaRecibio: string;
    fechaCreacion: string;
    fechaModificacion: string;

    marca: string;
    modelo: string;
    nSerie: string;
    modeloBateria: string;
    cantidadBaterias: number;
    anioFabricacionBaterias: number;

    mediciones: {
        enFFAB: number;
        enFFBC: number;
        enFFCA: number;
        enFNAN: number;
        enFNBN: number;
        enFNCN: number;
        CorrA: number;
        CorrB: number;
        CorrC: number;
        SalFFAB: number;
        SalFFBC: number;
        SalFFCA: number;
        SalFNAN: number;
        SalFNBN: number;
        SalFNCN: number;
        CorrSalidaA: number;
        CorrSalidaB: number;
        CorrSalidaC: number;
    };
    datosAdicionales: {
        frecuenciaEntrada: number;
        frecuenciaSalida: number;
        porcentajeCarga: number;
        tensionBateria: number;
        corrienteBateria: number;
        temperaturaUPS: number;
    };
    imagenes: Array<{
        idImagen: string;
        nombreArchivo: string;
        urlArchivo: string;
    }>;
}

const InformacionReporte = () => {
    const { id } = useParams<{ id: string }>();
    const context = useContext(TitleContext);
    const axiosInstance = useAxiosInstance();
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [reporte, setReporte] = useState<ReporteData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchReporte = async () => {
        if (!id) return;
        try {
            const response = await axiosInstance.get(`${VITE_BACKEND_URL}/api/reportes/readById/${id}`);
            console.log(response);
            
            setReporte(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        context?.setTitle("Información del Reporte");
    }, [context]);

    useEffect(() => {

        fetchReporte();
    }, [id]);

    if (loading) return <div>Cargando...</div>;
    if (error) return <HandleErrors error={error} handleWarningError={() => { }} handleFatalError={() => { }} />;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    };

    return (
        <ExportarReporte
            fileName={`reporte_${reporte?.idReporte || 'exportado'}.pdf`}
            buttonText="Exportar a PDF"
            buttonClassName=""
            onSuccess={() => console.log('PDF exportado correctamente')}
            onError={(error) => console.error('Error al exportar:', error)}
        >
            <div className="informacion-reporte">
                <h2>Información del Reporte</h2>

            {/* Información General */}
            <section className="reporte-section">
                <h3>Información General</h3>
                <div className="form-grid">
                    <div className="display-row">
                        <label className="display-label">Cliente</label>
                        <div className="display-value">{reporte?.cliente}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Dirección</label>
                        <div className="display-value">{reporte?.direccion}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Ciudad</label>
                        <div className="display-value">{reporte?.ciudad}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Encargado</label>
                        <div className="display-value">{reporte?.encargado}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Tipo</label>
                        <div className="display-value">{reporte?.tipo}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Estado</label>
                        <div className="display-value">{reporte?.estado}</div>
                    </div>
                </div>
            </section>

            {/* Información del Equipo */}
            <section className="reporte-section">
                <h3>Información del Equipo</h3>
                <div className="form-grid">
                    <div className="display-row">
                        <label className="display-label">Marca</label>
                        <div className="display-value">{reporte?.marca}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Modelo</label>
                        <div className="display-value">{reporte?.modelo}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Número de Serie</label>
                        <div className="display-value">{reporte?.nSerie}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Modelo de Batería</label>
                        <div className="display-value">{reporte?.modeloBateria}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Cantidad de Baterías</label>
                        <div className="display-value">{reporte?.cantidadBaterias}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Año de Fabricación de Baterías</label>
                        <div className="display-value">{reporte?.anioFabricacionBaterias}</div>
                    </div>
                </div>
            </section>

            {/* Mediciones Eléctricas de Entrada */}
            <section className="reporte-section">
                <h3>Mediciones Eléctricas de Entrada</h3>
                <div className="form-grid">
                    <div className="display-row">
                        <label className="display-label">FF AB</label>
                        <div className="display-value">{reporte?.mediciones.enFFAB}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">FF BC</label>
                        <div className="display-value">{reporte?.mediciones.enFFBC}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">FF CA</label>
                        <div className="display-value">{reporte?.mediciones.enFFCA}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">FN AN</label>
                        <div className="display-value">{reporte?.mediciones.enFNAN}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">FN BN</label>
                        <div className="display-value">{reporte?.mediciones.enFNBN}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">FN CN</label>
                        <div className="display-value">{reporte?.mediciones.enFNCN}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Corriente A</label>
                        <div className="display-value">{reporte?.mediciones.CorrA}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Corriente B</label>
                        <div className="display-value">{reporte?.mediciones.CorrB}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Corriente C</label>
                        <div className="display-value">{reporte?.mediciones.CorrC}</div>
                    </div>
                </div>
            </section>

            {/* Mediciones Eléctricas de Salida */}
            <section className="reporte-section">
                <h3>Mediciones Eléctricas de Salida</h3>
                <div className="form-grid">
                    <div className="display-row">
                        <label className="display-label">FF AB</label>
                        <div className="display-value">{reporte?.mediciones.SalFFAB}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">FF BC</label>
                        <div className="display-value">{reporte?.mediciones.SalFFBC}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">FF CA</label>
                        <div className="display-value">{reporte?.mediciones.SalFFCA}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">FN AN</label>
                        <div className="display-value">{reporte?.mediciones.SalFNAN}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">FN BN</label>
                        <div className="display-value">{reporte?.mediciones.SalFNBN}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">FN CN</label>
                        <div className="display-value">{reporte?.mediciones.SalFNCN}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Corriente A</label>
                        <div className="display-value">{reporte?.mediciones.CorrSalidaA}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Corriente B</label>
                        <div className="display-value">{reporte?.mediciones.CorrSalidaB}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Corriente C</label>
                        <div className="display-value">{reporte?.mediciones.CorrSalidaC}</div>
                    </div>
                </div>
            </section>

            {/* Datos Adicionales */}
            <section className="reporte-section">
                <h3>Datos Adicionales</h3>
                <div className="form-grid">
                    <div className="display-row">
                        <label className="display-label">Frecuencia Entrada</label>
                        <div className="display-value">{reporte?.datosAdicionales.frecuenciaEntrada}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Frecuencia Salida</label>
                        <div className="display-value">{reporte?.datosAdicionales.frecuenciaSalida}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">% Carga</label>
                        <div className="display-value">{reporte?.datosAdicionales.porcentajeCarga}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Tensión Batería</label>
                        <div className="display-value">{reporte?.datosAdicionales.tensionBateria}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Corriente Batería</label>
                        <div className="display-value">{reporte?.datosAdicionales.corrienteBateria}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Temperatura UPS</label>
                        <div className="display-value">{reporte?.datosAdicionales.temperaturaUPS}</div>
                    </div>
                </div>
            </section>

            {/* Información del Reporte */}
            <section className="reporte-section">
                <h3>Información del Reporte</h3>
                <div className="form-grid">
                    <div className="display-row">
                        <label className="display-label">Nombre Realizó</label>
                        <div className="display-value">{reporte?.nombreRealizo}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Nombre Recibió</label>
                        <div className="display-value">{reporte?.nombreRecibio}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Fecha Realizó</label>
                        <div className="display-value">{reporte?.fechaRealizo ? formatDate(reporte.fechaRealizo) : ''}</div>
                    </div>
                    <div className="display-row">
                        <label className="display-label">Fecha Recibió</label>
                        <div className="display-value">{reporte?.fechaRecibio ? formatDate(reporte.fechaRecibio) : ''}</div>
                    </div>
                </div>
                <div className="display-row">
                    <label className="display-label">Observaciones</label>
                    <div className="display-value" style={{ whiteSpace: 'pre-wrap' }}>{reporte?.observaciones}</div>
                </div>
            </section>

            {/* Imágenes de Referencia */}
            {reporte?.imagenes && reporte.imagenes.length > 0 && (
                <section className="reporte-section">
                    <h3>Imágenes de Referencia</h3>
                    <div className="imagenes-grid">
                        {reporte.imagenes.map((img) => {
                            console.log('URL de imagen:', img.urlArchivo);
                            return (
                                <img key={img.idImagen} src={`${VITE_BACKEND_URL}${img.urlArchivo}`} alt={img.nombreArchivo} className="imagen-referencia" />
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Sección de Firmas */}
            <section className="reporte-section" style={{ marginTop: '40px' }}>
                <h3>Firmas</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '40px' }}>
                    {/* Firma Realizó */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            border: '1px solid #000',
                            minHeight: '80px',
                            marginBottom: '10px',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            paddingBottom: '5px'
                        }}>
                        </div>
                        <div style={{ borderTop: '1px solid #000', paddingTop: '5px' }}>
                            <strong>{reporte?.nombreRealizo}</strong>
                        </div>
                        <div style={{ fontSize: '12px', marginTop: '5px' }}>Quien realizó el reporte</div>
                    </div>

                    {/* Firma Recibió */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            border: '1px solid #000',
                            minHeight: '80px',
                            marginBottom: '10px',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            paddingBottom: '5px'
                        }}>
                        </div>
                        <div style={{ borderTop: '1px solid #000', paddingTop: '5px' }}>
                            <strong>{reporte?.nombreRecibio}</strong>
                        </div>
                        <div style={{ fontSize: '12px', marginTop: '5px' }}>Quien recibió el reporte</div>
                    </div>
                </div>
            </section>
                </div>
        </ExportarReporte>
    );
};

export default InformacionReporte;