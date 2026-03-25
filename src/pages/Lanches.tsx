import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import LancheForm from '@/components/LancheForm';
import LanchesList from '@/components/LanchesList';
import { getLancheCombos as getLanches } from '@/services/api';
import { LancheCombo as Lanche } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const Lanches = () => {
  const [lanches, setLanches] = useState<Lanche[]>([]);
  const [loading, setLoading] = useState(true);
  const [lancheEditando, setLancheEditando] = useState<Lanche | null>(null);

  // Extrair o isAdmin do contexto
  const { isAdmin } = useAuth();

  const fetchLanches = async () => {
    try {
      const data = await getLanches();
      setLanches(data);
    } catch (error) {
      console.error('Erro ao carregar lanches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanches();
  }, []);

  const handleSuccess = () => {
    fetchLanches();
    setLancheEditando(null);
  };

  const handleCancel = () => {
    setLancheEditando(null);
  };

  return (
    <div className="min-vh-100 bg-dark">
      <Navbar />
      <div className="container py-4">
        <div className="d-flex align-items-center mb-4">
          <i className="bi bi-cup-straw text-warning display-5 me-3"></i>
          <div>
            <h1 className="text-light mb-0">Bomboniere</h1>
            <p className="text-secondary mb-0">Gerencie os produtos e combos</p>
          </div>
        </div>

        {/* REGRA: Apenas Administradores vêem o formulário de criar/editar lanches */}
        {isAdmin && (
          <div className="row">
            <div className="col-12 mb-4">
              <LancheForm 
                onSuccess={handleSuccess} 
                lancheEditando={lancheEditando}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-light mb-0">
                <i className="bi bi-list-ul me-2"></i>
                Produtos Cadastrados
              </h4>
              <span className="badge bg-warning text-dark">
                {lanches.length} produto(s)
              </span>
            </div>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">A carregar...</span>
                </div>
              </div>
            ) : (
              <LanchesList 
                lanches={lanches} 
                onDelete={fetchLanches} 
                onEdit={(lanche) => {
                  setLancheEditando(lanche);
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

export default Lanches;