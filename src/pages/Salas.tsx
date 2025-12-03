import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SalaForm from '@/components/SalaForm';
import SalasList from '@/components/SalasList';
import { getSalas } from '@/services/api';
import { Sala } from '@/types';

const Salas = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [salaEditando, setSalaEditando] = useState<Sala | null>(null);

  const fetchSalas = async () => {
    try {
      const response = await getSalas();
      setSalas(response.data);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  const handleSuccess = () => {
    fetchSalas();
    setSalaEditando(null);
  };

  const handleCancel = () => {
    setSalaEditando(null);
  };

  return (
    <div className="min-vh-100 bg-dark">
      <Navbar />
      <div className="container py-4">
        <div className="d-flex align-items-center mb-4">
          <i className="bi bi-door-open text-warning display-5 me-3"></i>
          <div>
            <h1 className="text-light mb-0">Salas</h1>
            <p className="text-secondary mb-0">Gerencie as salas de exibição do cinema</p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 mb-4">
            <SalaForm 
              onSuccess={handleSuccess} 
              salaEditando={salaEditando}
              onCancel={handleCancel}
            />
          </div>
          <div className="col-lg-6 mb-4">
            <div className="card bg-dark border-secondary h-100">
              <div className="card-header bg-secondary text-light">
                <h5 className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Informações
                </h5>
              </div>
              <div className="card-body text-light">
                <p className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  As salas são utilizadas para agendar sessões de filmes.
                </p>
                <p className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Defina a capacidade para controlar a venda de ingressos.
                </p>
                <p className="mb-0">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Numere as salas de forma sequencial para melhor organização.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-light mb-0">
                <i className="bi bi-list-ul me-2"></i>
                Salas Cadastradas
              </h4>
              <span className="badge bg-warning text-dark">
                {salas.length} sala(s)
              </span>
            </div>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            ) : (
              <SalasList 
                salas={salas} 
                onDelete={fetchSalas} 
                onEdit={(sala) => {
                  setSalaEditando(sala);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Salas;