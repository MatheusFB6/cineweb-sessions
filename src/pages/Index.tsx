import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Hero Section */}
      <section className="bg-dark text-light py-5 flex-grow-1 d-flex align-items-center">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="mb-4">
                <span className="badge bg-warning text-dark px-3 py-2 mb-3">
                  <i className="bi bi-star-fill me-1"></i>
                  Sistema de Gerenciamento
                </span>
                <h1 className="display-3 fw-bold mb-4">
                  <span className="text-warning">Cine</span>Web
                </h1>
                <p className="lead text-secondary mb-4">
                  Gerencie filmes, salas, sessões e vendas de ingressos de forma simples e eficiente.
                  Sistema completo para administração de cinemas.
                </p>
              </div>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/filmes" className="btn btn-warning btn-lg px-4">
                  <i className="bi bi-camera-reels me-2"></i>
                  Gerenciar Filmes
                </Link>
                <Link to="/sessoes" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-calendar-event me-2"></i>
                  Ver Sessões
                </Link>
              </div>
            </div>
            <div className="col-lg-6 mt-5 mt-lg-0">
              <div className="row g-4">
                <div className="col-6">
                  <div className="card bg-secondary border-0 h-100">
                    <div className="card-body text-center py-4">
                      <i className="bi bi-film text-warning display-4"></i>
                      <h5 className="text-light mt-3">Filmes</h5>
                      <p className="text-secondary small mb-0">
                        Cadastre e gerencie o catálogo de filmes
                      </p>
                      <Link to="/filmes" className="stretched-link"></Link>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card bg-secondary border-0 h-100">
                    <div className="card-body text-center py-4">
                      <i className="bi bi-door-open text-warning display-4"></i>
                      <h5 className="text-light mt-3">Salas</h5>
                      <p className="text-secondary small mb-0">
                        Configure as salas do cinema
                      </p>
                      <Link to="/salas" className="stretched-link"></Link>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card bg-secondary border-0 h-100">
                    <div className="card-body text-center py-4">
                      <i className="bi bi-calendar-check text-warning display-4"></i>
                      <h5 className="text-light mt-3">Sessões</h5>
                      <p className="text-secondary small mb-0">
                        Agende horários de exibição
                      </p>
                      <Link to="/sessoes" className="stretched-link"></Link>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card bg-secondary border-0 h-100">
                    <div className="card-body text-center py-4">
                      <i className="bi bi-ticket-perforated text-warning display-4"></i>
                      <h5 className="text-light mt-3">Ingressos</h5>
                      <p className="text-secondary small mb-0">
                        Realize vendas de ingressos
                      </p>
                      <Link to="/sessoes" className="stretched-link"></Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-dark text-secondary py-3 border-top border-secondary">
        <div className="container text-center">
          <small>
            <i className="bi bi-code-slash me-1"></i>
            CineWeb © 2025 - Trabalho Acadêmico - React + TypeScript + Bootstrap
          </small>
        </div>
      </footer>
    </div>
  );
};

export default Index;
