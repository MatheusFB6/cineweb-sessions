import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FilmeForm from '@/components/FilmeForm';
import FilmesList from '@/components/FilmesList';
import { getFilmes } from '@/services/api';
import { Filme } from '@/types';

const Filmes = () => {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFilmes = async () => {
    try {
      const response = await getFilmes();
      setFilmes(response.data);
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilmes();
  }, []);

  return (
    <div className="min-vh-100 bg-dark">
      <Navbar />
      <div className="container py-4">
        <div className="d-flex align-items-center mb-4">
          <i className="bi bi-camera-reels text-warning display-5 me-3"></i>
          <div>
            <h1 className="text-light mb-0">Filmes</h1>
            <p className="text-secondary mb-0">Gerencie o catálogo de filmes do cinema</p>
          </div>
        </div>

        <div className="row">
          <div className="col-12 mb-4">
            <FilmeForm onSuccess={fetchFilmes} />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-light mb-0">
                <i className="bi bi-list-ul me-2"></i>
                Filmes Cadastrados
              </h4>
              <span className="badge bg-warning text-dark">
                {filmes.length} filme(s)
              </span>
            </div>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            ) : (
              <FilmesList filmes={filmes} onDelete={fetchFilmes} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filmes;
