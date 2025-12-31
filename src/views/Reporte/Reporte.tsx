import "./Reporte.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { PiFileArchiveBold, PiMagnifyingGlassBold, PiPencilBold, PiTrashBold, PiEyeBold, PiFunnelBold, PiDownloadBold } from "react-icons/pi";
import Button from "../../components/buttons/Button";
import Input from "../../components/inputs/Input";
import InputSelect from "../../components/inputs/InputSelect";
import { TitleContext } from "../../context/TitleContext";
import useAxiosInstance from "../../functions/axiosInstance";

interface ReportesData {
  id: string;
  cliente: string;
  marca: string;
  modelo: string;
  nSerie: string;
  tipo: string;
  estado: "Completado" | "Borrador" | "Pendiente";
  fechaCreacion: string;
  fechaModificacion: string;
  creador: string;
}

interface FilterData {
  termBusqueda: string;
  filterEstado: string;
  filterTipo: string;
}

const Reporte = () => {
  //Usar useEffect para mostrar el titulo cuando se monta el componente, esto evita que haya errores en consola
  const context = useContext(TitleContext);
  useEffect(() => {
    context?.setTitle("Reportes")
  }, []);

  //Importamos variables globales
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  //Creamos el hook para llamar la instancia de axios
  const axiosInstance = useAxiosInstance();

  const navigate = useNavigate();
  const { register, control, setValue } = useForm<FilterData>({
    defaultValues: {
      termBusqueda: "",
      filterEstado: "Todos",
      filterTipo: "Todos"
    }
  });

  // Estados
  const [reportes, setReportes] = useState<ReportesData[]>([]);
  const [filteredReportes, setFilteredReportes] = useState<ReportesData[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedReporte, setSelectedReporte] = useState<number | null>(null);
  const [fData, setfData] = useState<FilterData>({ termBusqueda: "", filterEstado: "Todos", filterTipo: "Todos" });
  const [openError, setOpenError] = useState<boolean>(false);
  const [error, setError] = useState<any>();

  // Cargar reportes (simulados por ahora)
  const fetchData = async (filterParams?: FilterData): Promise<void> => {
    //Si se reciben nuevos parámetros sobreescribimos el estado, si no usamos el actual
    const filterData = filterParams || fData; //Se creó esta variable para usar la información desde el inicio de la función sin esperar a que se actualice el estado
    const url = `${VITE_BACKEND_URL}/api/reportes?termBusqueda=${filterData.termBusqueda}&filterEstado=${filterData.filterEstado}&filterTipo=${filterData.filterTipo}`;
    try {
      //Validamos que cumplan los tipos de datos, al venir de rutas todo es string
      if (typeof filterData.termBusqueda !== "string" || typeof filterData.filterEstado !== "string" || typeof filterData.filterTipo !== "string")
        throw new Error("typeError");

      const response = await axiosInstance.get(url);
      console.log(response);


      setReportes(response.data.data);
      console.log("reportes:", reportes);

      setFilteredReportes(reportes);
      console.log("Filtrados: ", filteredReportes);
      
    } catch (error) {
      setError(error);
      setOpenError(true);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  // Handlers
  const handleCrearReporte = () => {
    navigate('/crear');
  };

  const handleVerReporte = (id: number) => {
    console.log('Ver reporte:', id);
    // navigate(`/reporte/${id}`);
  };

  const handleEditarReporte = (id: number) => {
    console.log('Editar reporte:', id);
    navigate(`/editar/${id}`);
  };

  const handleEliminarReporte = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este reporte?')) {
      // Aquí harías: await axios.delete(`/api/reportes/${id}`)
      setReportes(reportes.filter(r => r.id !== id));
      console.log('Reporte eliminado:', id);
    }
  };

  const handleExportarPDF = (id: number) => {
    console.log('Exportar a PDF:', id);
    // Aquí implementarías la lógica de exportación
  };

  const limpiarFiltros = () => {
    setValue("termBusqueda", "");
    setValue("filterEstado", "Todos");
    setValue("filterTipo", "Todos");
  };

  // Opciones para los selects
  const estadoOptions = [
    { value: "Todos", label: "Todos" },
    { value: "Completado", label: "Completado" },
    { value: "Borrador", label: "Borrador" },
    { value: "Pendiente", label: "Pendiente" }
  ];

  const tipoOptions = [
    { value: "Todos", label: "Todos" },
    { value: "Preventivo", label: "Preventivo" },
    { value: "Correctivo", label: "Correctivo" },
    { value: "Emergencia", label: "Emergencia" },
    { value: "Instalación", label: "Instalación" },
    { value: "Inspección", label: "Inspección" }
  ];

  return (
    <div className="reporte-view">
      {/* Encabezado con título y botón crear */}
      <div className="reporte-header">
        <div className="reporte-header-content">
          <h1>Gestión de Reportes</h1>
          <p className="reporte-subtitle">
            Administra todos los reportes de mantenimiento
          </p>
        </div>
        <Button
          btnType="button"
          className="primary"
          text="Crear Reporte"
          onClick={handleCrearReporte}
        />
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="reporte-search-section">
        <div className="search-box-wrapper">
          <PiMagnifyingGlassBold className="search-icon-inline" />
          <Input
            type="text"
            name="termBusqueda"
            text="Buscar por cliente, marca, modelo o serie..."
            register={register}
            required={false}
          />
        </div>

        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <PiFunnelBold />
          Filtros
        </button>
      </div>

      {/* Panel de filtros expandible */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group-custom">
            <InputSelect
              isSearchable={false}
              name="filterEstado"
              text="Estado"
              options={estadoOptions}
              control={control}
              onChangeAction={null}
            />
          </div>

          <div className="filter-group-custom">
            <InputSelect
              isSearchable={false}
              name="filterTipo"
              text="Tipo de Servicio"
              options={tipoOptions}
              control={control}
              onChangeAction={null}
            />
          </div>

          <button className="clear-filters-btn" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Resumen de resultados */}
      <div className="results-summary">
        <p>
          Mostrando <strong>{filteredReportes.length}</strong> de{" "}
          <strong>{reportes.length}</strong> reportes
        </p>
      </div>

      {/* Tabla de reportes */}
      <div className="reportes-table-container">
        {filteredReportes.length > 0 ? (
          <table className="reportes-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Equipo</th>
                <th>N° Serie</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Técnico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredReportes.map((reporte) => (
                <tr
                  key={reporte.id}
                  className={selectedReporte === reporte.id ? "selected" : ""}
                  onClick={() => setSelectedReporte(reporte.id)}
                >
                  <td className="td-cliente">
                    <div className="cliente-cell">
                      <PiFileArchiveBold className="table-icon" />
                      <span>{reporte.cliente}</span>
                    </div>
                  </td>
                  <td>
                    <div className="equipo-cell">
                      <strong>{reporte.marca}</strong>
                      <span className="modelo">{reporte.modelo}</span>
                    </div>
                  </td>
                  <td className="td-serie">{reporte.nSerie}</td>
                  <td>
                    <span className="tipo-badge">{reporte.tipo}</span>
                  </td>
                  <td>
                    <span
                      className={`estado-badge estado-${reporte.estado.toLowerCase()}`}
                    >
                      {reporte.estado}
                    </span>
                  </td>
                  <td className="td-fecha">{reporte.fechaCreacion}</td>
                  <td className="td-tecnico">{reporte.creador}</td>
                  <td className="td-acciones">
                    <div className="acciones-group">
                      <button
                        className="action-btn action-btn-view"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerReporte(reporte.id);
                        }}
                        title="Ver reporte"
                      >
                        <PiEyeBold />
                      </button>
                      <button
                        className="action-btn action-btn-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditarReporte(reporte.id);
                        }}
                        title="Editar reporte"
                      >
                        <PiPencilBold />
                      </button>
                      <button
                        className="action-btn action-btn-pdf"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportarPDF(reporte.id);
                        }}
                        title="Exportar a PDF"
                      >
                        <PiDownloadBold />
                      </button>
                      <button
                        className="action-btn action-btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEliminarReporte(reporte.id);
                        }}
                        title="Eliminar reporte"
                      >
                        <PiTrashBold />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <PiFileArchiveBold className="empty-icon" />
            <h3>No se encontraron reportes</h3>
            <p>Intenta cambiar los filtros o crear un nuevo reporte</p>
            <Button
              btnType="button"
              className="primary"
              text="Crear Primer Reporte"
              onClick={handleCrearReporte}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Reporte;