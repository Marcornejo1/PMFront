import './Dashboard.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiFileArchiveBold, PiCheckCircleBold, PiClockBold, PiPlusBold, PiChartBarBold } from 'react-icons/pi';
import Button from '../../components/buttons/Button';

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

const Dashboard = () => {
  const navigate = useNavigate();

  // Estados para las estadísticas
  const [stats, setStats] = useState({
    totalReportes: 0,
    reportesCompletados: 0,
    reportesPendientes: 0,
    reportesMesActual: 0
  });

  const [reportesRecientes, setReportesRecientes] = useState<ReporteReciente[]>([]);
  const [borradores, setBorradores] = useState<Borrador[]>([]);

  useEffect(() => {
    // Aquí deberías hacer fetch a tu API
    // Por ahora simulamos datos
    setStats({
      totalReportes: 156,
      reportesCompletados: 142,
      reportesPendientes: 8,
      reportesMesActual: 23
    });
    setReportesRecientes([
      { id: 1, cliente: 'Empresa ABC', fecha: '2025-12-06', tipo: 'Preventivo', estado: 'Completado' },
      { id: 2, cliente: 'Corporación XYZ', fecha: '2025-12-05', tipo: 'Correctivo', estado: 'Borrador' },
      { id: 3, cliente: 'Industrias DEF', fecha: '2025-12-04', tipo: 'Preventivo', estado: 'Completado' },
      { id: 4, cliente: 'Grupo GHI', fecha: '2025-12-03', tipo: 'Emergencia', estado: 'Borrador' },
      { id: 5, cliente: 'Comercial JKL', fecha: '2025-12-02', tipo: 'Preventivo', estado: 'Completado' }
    ]);

    // Cargar borradores (podrían venir de la API o localStorage)
    setBorradores([
      { id: 'draft-1', cliente: 'Corporación XYZ', fechaGuardado: '2025-12-05 14:30', porcentajeCompletado: 65 },
      { id: 'draft-2', cliente: 'Grupo GHI', fechaGuardado: '2025-12-03 09:15', porcentajeCompletado: 40 }
    ]);
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
                <div className="draft-item-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${borrador.porcentajeCompletado}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{borrador.porcentajeCompletado}% completado</span>
                </div>
                <Button
                  btnType="button"
                  className="primary"
                  text="Continuar"
                  onClick={() => navigate('/crear')}
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
                    <span className={`recent-item-status ${
                      reporte.estado === 'Completado' ? 'status-completed' :
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
    </div>
  );
};

    export default Dashboard;