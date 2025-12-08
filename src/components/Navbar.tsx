import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-warning">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <i className="bi bi-film text-warning me-2 fs-4"></i>
          <span className="fw-bold">CineWeb</span>
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${isActive('/') ? 'active text-warning' : ''}`}>
                <i className="bi bi-house-door me-1"></i> Início
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/filmes" className={`nav-link ${isActive('/filmes') ? 'active text-warning' : ''}`}>
                <i className="bi bi-camera-reels me-1"></i> Filmes
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/salas" className={`nav-link ${isActive('/salas') ? 'active text-warning' : ''}`}>
                <i className="bi bi-door-open me-1"></i> Salas
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/sessoes" className={`nav-link ${isActive('/sessoes') ? 'active text-warning' : ''}`}>
                <i className="bi bi-calendar-event me-1"></i> Sessões
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/lanches" className={`nav-link ${isActive('/lanches') ? 'active text-warning' : ''}`}>
                <i className="bi bi-cup-straw me-1"></i> Lanches
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;