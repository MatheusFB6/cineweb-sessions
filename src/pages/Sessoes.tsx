import { useState, useEffect } from 'react';
import SessaoForm from '@/components/SessaoForm';
import SessoesList from '@/components/SessoesList';
import { getSessoes } from '@/services/api';
import { Sessao } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const Sessoes = () => {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessaoEditando, setSessaoEditando] = useState<Sessao | null>(null);

  // Extrair o isAdmin do nosso contexto
  const { isAdmin } = useAuth();

  const fetchSessoes = async () => {
    try {
      const data = await getSessoes();
      setSessoes(data);
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessoes();
  }, []);

  const handleSuccess = () => {
    fetchSessoes();
    setSessaoEditando(null);
  };

  const handleCancel = () => {
    setSessaoEditando(null);
  };

  return (
    <>
      <div className="container py-4">
        <div className="d-flex align-items-center mb-4">
          <i className="bi bi-calendar-event text-warning display-5 me-3"></i>
          <div>
            <h1 className="text-light mb-0">Sessões</h1>
            <p className="text-secondary mb-0">Gerencie as sessões e venda de ingressos</p>
          </div>
        </div>

        {/* REGRA: Apenas Administradores vêem o formulário de criar/editar sessões */}
        {isAdmin && (
          <div className="row">
            <div className="col-12 mb-4">
              <SessaoForm 
                onSuccess={handleSuccess} 
                sessaoEditando={sessaoEditando}
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
                Sessões Agendadas
              </h4>
              <span className="badge bg-warning text-dark">
                {sessoes.length} sessão(ões)
              </span>
            </div>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">A carregar...</span>
                </div>
              </div>
            ) : (
              <SessoesList 
                sessoes={sessoes} 
                onDelete={fetchSessoes} 
                onEdit={(sessao) => {
                  setSessaoEditando(sessao);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sessoes;