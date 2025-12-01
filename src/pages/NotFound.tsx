import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const NotFound = () => {
  return (
    <div className="min-vh-100 bg-dark">
      <Navbar />
      <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 76px)' }}>
        <div className="text-center">
          <i className="bi bi-exclamation-triangle text-warning display-1 mb-4"></i>
          <h1 className="display-1 text-light fw-bold">404</h1>
          <p className="lead text-secondary mb-4">
            Oops! A página que você está procurando não foi encontrada.
          </p>
          <Link to="/" className="btn btn-warning btn-lg">
            <i className="bi bi-house me-2"></i>
            Voltar para o Início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
