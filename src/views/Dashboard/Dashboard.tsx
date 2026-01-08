import './Dashboard.css';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiFileArchiveBold, PiCheckCircleBold, PiClockBold, PiChartBarBold } from 'react-icons/pi';
import Button from '../../components/buttons/Button';
import { TitleContext } from '../../context/TitleContext';
import useAxiosInstance from '../../functions/axiosInstance';
import HandleErrors from '../../components/helpers/handleErrors/HandleErrors';

interface ReporteReciente {
  id: number;
  cliente: string;
  fecha: string;
  tipo: string;
  estado: string;
}

interface Borrador {
  id: string;
  cliente: string;
  fechaGuardado: string;
  porcentajeCompletado: number;
}

interface Stats {
  totalReportes: number;
  reportesCompletados: number;
  reportesPendientes: number;
  reportesMesActual: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  // Usar use effect para mostrar el título cuando se monta el componente, esto evita que haya errores en consola
  const context = useContext(TitleContext);
  useEffect(() => {
    context?.setTitle("Dashboard");
  }, []);

  //Importamos variables globales
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  //Estado del control de errores
  const [openError, setOpenError] = useState<boolean>(false);
  const [error, setError] = useState<any>();

  // Estados para las estadísticas
  const [stats, setStats] = useState<Stats>({ totalReportes: 0, reportesCompletados: 0, reportesPendientes: 0, reportesMesActual: 0 });

  const [reportesRecientes, setReportesRecientes] = useState<ReporteReciente[]>([]);
  const [borradores, setBorradores] = useState<Borrador[]>([]);

  //Creamos el hook para llamar la instancia de axios
  const axiosInstance = useAxiosInstance();

  //Obtenemos informacion usando la libreria AXIOS y useEffect
  const fetchData = async (): Promise<void> => {

    const url = `${VITE_BACKEND_URL}/api/reportes/readDash`;
    try {
      const response = await axiosInstance.get(url);
      console.log(response);     
      setStats(response.data.estadisticas);
      setReportesRecientes(response.data.reportesRecientes);
      setBorradores(response.data.borradores);
    } catch (error) {
      setError(error);
      setOpenError(true);
    };
  };


useEffect(() => {
    fetchData();
  }, []);

  const handleCrearReporte = () => {
    navigate('/crear');
  };

  const handleVerReportes = () => {
    navigate('/reporte');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Sistema de Gestión de Reportes de Mantenimiento</p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="dashboard-stats">
        <div className="stat-card stat-card--primary">
          <div className="stat-card-icon">
            <PiFileArchiveBold />
          </div>
          <div className="stat-card-content">
            <h3>{stats.totalReportes}</h3>
            <p>Total Reportes</p>
          </div>
        </div>

        <div className="stat-card stat-card--success">
          <div className="stat-card-icon">
            <PiCheckCircleBold />
          </div>
          <div className="stat-card-content">
            <h3>{stats.reportesCompletados}</h3>
            <p>Completados</p>
          </div>
        </div>

        <div className="stat-card stat-card--warning">
          <div className="stat-card-icon">
            <PiClockBold />
          </div>
          <div className="stat-card-content">
            <h3>{stats.reportesPendientes}</h3>
            <p>Pendientes</p>
          </div>
        </div>

        <div className="stat-card stat-card--info">
          <div className="stat-card-icon">
            <PiChartBarBold />
          </div>
          <div className="stat-card-content">
            <h3>{stats.reportesMesActual}</h3>
            <p>Este Mes</p>
          </div>
        </div>
      </div>

      {/* Accesos Rápidos */}
      <div className="dashboard-actions">
        <h2>Accesos Rápidos</h2>
        <div className="action-buttons">
          <Button
            btnType="button"
            className="primary"
            text="Crear Reporte"
            onClick={handleCrearReporte}
          />
          <Button
            btnType="button"
            className="secondary"
            text="Ver Reportes"
            onClick={handleVerReportes}
          />
        </div>
      </div>

      {/* Borradores Pendientes */}
      {borradores.length > 0 && (
        <div className="dashboard-drafts">
          <h2>Borradores Pendientes</h2>
          <div className="drafts-list">
            {borradores.map((borrador) => (
              <div key={borrador.id} className="draft-item">
                <div className="draft-item-header">
                  <div className="draft-item-icon">
                    <PiFileArchiveBold />
                  </div>
                  <div className="draft-item-info">
                    <h4>{borrador.cliente}</h4>
                    <span className="draft-item-date">
                      Guardado: {borrador.fechaGuardado}
                    </span>
                  </div>
                </div>
                <Button
                  btnType="button"
                  className="primary"
                  text="Continuar"
                  onClick={() =>  navigate(`/editar/${borrador.id}`)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reportes Recientes */}
      <div className="dashboard-recent">
        <h2>Reportes Recientes</h2>
        <div className="recent-list">
          {reportesRecientes.length > 0 ? (
            reportesRecientes.map((reporte) => (
              <div key={reporte.id} className="recent-item">
                <div className="recent-item-icon">
                  <PiFileArchiveBold />
                </div>
                <div className="recent-item-content">
                  <h4>{reporte.cliente}</h4>
                  <div className="recent-item-details">
                    <span className="recent-item-date">{reporte.fecha}</span>
                    <span className="recent-item-divider">•</span>
                    <span className="recent-item-type">{reporte.tipo}</span>
                    <span className="recent-item-divider">•</span>
                    <span className={`recent-item-status ${reporte.estado === 'Completado' ? 'status-completed' :
                      reporte.estado === 'Borrador' ? 'status-draft' :
                        'status-pending'
                      }`}>
                      {reporte.estado}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state">No hay reportes recientes</p>
          )}
        </div>
      </div>

      {/* Manejo de Errores */}
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

export default Dashboard;