import "./Reporte.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  PiFileArchiveBold,
  PiMagnifyingGlassBold,
  PiPencilBold,
  PiTrashBold,
  PiEyeBold,
  PiFunnelBold,
  PiDownloadBold
} from "react-icons/pi";
import Button from "../../components/buttons/Button";
import Input from "../../components/inputs/Input";
import InputSelect from "../../components/inputs/InputSelect";

interface Reporte {
  id: number;
  cliente: string;
  marca: string;
  modelo: string;
  nSerie: string;
  tipo: string;
  estado: "Completado" | "Borrador" | "Pendiente";
  fechaCreacion: string;
  fechaModificacion: string;
  tecnico: string;
}

interface FilterFormData {
  searchTerm: string;
  filterEstado: string;
  filterTipo: string;
}

const Reporte = () => {
  const navigate = useNavigate();
  const { register, control, watch, setValue } = useForm<FilterFormData>({
    defaultValues: {
      searchTerm: "",
      filterEstado: "Todos",
      filterTipo: "Todos"
    }
  });

  // Estados
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [filteredReportes, setFilteredReportes] = useState<Reporte[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedReporte, setSelectedReporte] = useState<number | null>(null);

  // Observar cambios en los campos del formulario
  const searchTerm = watch("searchTerm");
  const filterEstado = watch("filterEstado");
  const filterTipo = watch("filterTipo");

  // Cargar reportes (simulados por ahora)
  useEffect(() => {
    // Aquí harías: await axios.get('/api/reportes')
    const reportesSimulados: Reporte[] = [
      {
        id: 1,
        cliente: "Empresa ABC",
        marca: "APC",
        modelo: "Smart-UPS 3000",
        nSerie: "AS1234567890",
        tipo: "Preventivo",
        estado: "Completado",
        fechaCreacion: "2025-12-01",
        fechaModificacion: "2025-12-01",
        tecnico: "Juan Pérez"
      },
      {
        id: 2,
        cliente: "Corporación XYZ",
        marca: "Eaton",
        modelo: "9PX 5000",
        nSerie: "ET9876543210",
        tipo: "Correctivo",
        estado: "Borrador",
        fechaCreacion: "2025-12-05",
        fechaModificacion: "2025-12-06",
        tecnico: "María García"
      },
      {
        id: 3,
        cliente: "Industrias DEF",
        marca: "Vertiv",
        modelo: "Liebert GXT4",
        nSerie: "VT5555555555",
        tipo: "Preventivo",
        estado: "Completado",
        fechaCreacion: "2025-11-28",
        fechaModificacion: "2025-11-28",
        tecnico: "Carlos López"
      },
      {
        id: 4,
        cliente: "Grupo GHI",
        marca: "Schneider",
        modelo: "Galaxy VS",
        nSerie: "SC1111111111",
        tipo: "Emergencia",
        estado: "Borrador",
        fechaCreacion: "2025-12-03",
        fechaModificacion: "2025-12-04",
        tecnico: "Ana Martínez"
      },
      {
        id: 5,
        cliente: "Comercial JKL",
        marca: "APC",
        modelo: "Smart-UPS 1500",
        nSerie: "AS2222222222",
        tipo: "Instalación",
        estado: "Completado",
        fechaCreacion: "2025-11-25",
        fechaModificacion: "2025-11-25",
        tecnico: "Juan Pérez"
      }
    ];

    setReportes(reportesSimulados);
    setFilteredReportes(reportesSimulados);
  }, []);

  // Filtrar reportes cuando cambia la búsqueda o filtros
  useEffect(() => {
    let resultado = [...reportes];

    // Filtrar por búsqueda (cliente, marca, modelo, serie)
    if (searchTerm) {
      resultado = resultado.filter(reporte =>
        reporte.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reporte.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reporte.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reporte.nSerie.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (filterEstado !== "Todos") {
      resultado = resultado.filter(reporte => reporte.estado === filterEstado);
    }

    // Filtrar por tipo
    if (filterTipo !== "Todos") {
      resultado = resultado.filter(reporte => reporte.tipo === filterTipo);
    }

    setFilteredReportes(resultado);
  }, [searchTerm, filterEstado, filterTipo, reportes]);

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
    setValue("searchTerm", "");
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
            name="searchTerm"
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
                  <td className="td-tecnico">{reporte.tecnico}</td>
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