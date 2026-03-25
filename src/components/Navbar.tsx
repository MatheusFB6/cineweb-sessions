import { Link, useNavigate } from 'react-router-dom';
import { NavLink } from '../components/NavLink';
import { useAuth } from '../contexts/AuthContext'; 

export default function Navbar() {
  const { user, isAuthenticated, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-warning border-3 shadow-sm mb-4">
      <div className="container">
        <Link to="/filmes" className="navbar-brand fw-bold text-warning tracking-wider">
          <i className="bi bi-camera-reels-fill me-2"></i>
          CINEWEB
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav me-auto mb-2 mb-lg-0 space-x-2">
            <NavLink to="/filmes" className="nav-link text-light hover-warning">Filmes</NavLink>
            <NavLink to="/sessoes" className="nav-link text-light hover-warning">Sessões</NavLink>
            <NavLink to="/lanches" className="nav-link text-light hover-warning">Lanches</NavLink>
            {isAdmin && <NavLink to="/salas" className="nav-link text-light hover-warning">Salas</NavLink>}
          </div>

          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-3 text-light">
                {isAdmin && (
                  <Link to="/admin/dashboard" className="btn btn-outline-warning btn-sm border-2 fw-bold">
                    <i className="bi bi-shield-lock-fill me-1"></i>Painel Admin
                  </Link>
                )}
                <span className="small">
                  Olá, <strong className="text-warning">{user?.name}</strong>
                </span>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline-warning btn-sm"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-warning btn-sm fw-bold text-dark">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}