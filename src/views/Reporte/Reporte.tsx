import "./Reporte.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { PiFileArchiveBold, PiMagnifyingGlassBold, PiPencilBold, PiTrashBold, PiEyeBold, PiFunnelBold, PiDownloadBold } from "react-icons/pi";
import Button from "../../components/buttons/Button";
import Input from "../../components/inputs/Input";
import InputSelect from "../../components/inputs/InputSelect";
import { TitleContext } from "../../context/TitleContext";
import useAxiosInstance from "../../functions/axiosInstance";
import HandleErrors from "../../components/helpers/handleErrors/HandleErrors";

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

  const watchedValues = useWatch({ control });

  // Estados
  const [reportes, setReportes] = useState<ReportesData[]>([]);
  const [filteredReportes, setFilteredReportes] = useState<ReportesData[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedReporte, setSelectedReporte] = useState<string | null>(null);
  const [openError, setOpenError] = useState<boolean>(false);
  const [error, setError] = useState<any>();

  // Cargar reportes (simulados por ahora)
  const fetchData = async (): Promise<void> => {
    const url = `${VITE_BACKEND_URL}/api/reportes`;
    try {
      const response = await axiosInstance.get(url);
      console.log(response);

      setReportes(response.data);
      console.log("reportes:", response.data);
      
    } catch (error) {
      setError(error);
      setOpenError(true);
    }
  }

  // Función para filtrar reportes localmente
  const filterReportes = (reportes: ReportesData[], filters: Partial<FilterData>): ReportesData[] => {
    return reportes.filter((reporte) => {
      const term = filters.termBusqueda || "";
      const matchesTerm = term === "" ||
        (reporte.cliente && reporte.cliente.toLowerCase().includes(term.toLowerCase())) ||
        (reporte.marca && reporte.marca.toLowerCase().includes(term.toLowerCase())) ||
        (reporte.modelo && reporte.modelo.toLowerCase().includes(term.toLowerCase())) ||
        (reporte.nSerie && reporte.nSerie.toLowerCase().includes(term.toLowerCase()));

      const estado = filters.filterEstado || "Todos";
      const matchesEstado = estado === "Todos" || reporte.estado === estado;

      const tipo = filters.filterTipo || "Todos";
      const matchesTipo = tipo === "Todos" || reporte.tipo === tipo;

      return matchesTerm && matchesEstado && matchesTipo;
    });
  };

  // Filtrar reportes cuando cambien los filtros o los reportes
  useEffect(() => {
    const filtered = filterReportes(reportes, watchedValues);
    setFilteredReportes(filtered);
  }, [reportes, watchedValues]);

  useEffect(() => {
    fetchData();
  }, []);
  // Handlers
  const handleCrearReporte = () => {
    navigate('/crear');
  };

  const handleVerReporte = (id: string) => {
    console.log('Ver reporte:', id);
    navigate(`/informacion/${id}`);
  };

  const handleEditarReporte = (id: string) => {
    console.log('Editar reporte:', id);
    navigate(`/editar/${id}`);
  };

  const handleEliminarReporte = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este reporte?')) {
      // Aquí harías: await axios.delete(`/api/reportes/${id}`)
      setReportes(reportes.filter(r => r.id !== id));
      console.log('Reporte eliminado:', id);
    }
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
      {openError && (
        <HandleErrors
          error={error}
          handleWarningError={() => setOpenError(false)}
          handleFatalError={() => setOpenError(false)}
        />
      )}
    </div>
  );
};

export default Reporte;