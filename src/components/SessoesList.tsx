import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Para redirecionar para o login
import { Sessao, SessaoComDetalhes } from '@/types';
import { deleteSessao, getFilmes, getSalas } from '@/services/api';
import PedidoModal from './PedidoModal';
import { useAuth } from '@/contexts/AuthContext'; // 2. Nosso hook de autenticação

interface SessoesListProps {
  sessoes: Sessao[];
  onDelete: () => void;
  onEdit: (sessao: Sessao) => void;
}

const SessoesList = ({ sessoes, onDelete, onEdit }: SessoesListProps) => {
  const [sessoesDetalhadas, setSessoesDetalhadas] = useState<SessaoComDetalhes[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSessao, setSelectedSessao] = useState<SessaoComDetalhes | null>(null);

  // 3. Extraindo os dados e funções de navegação
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const enrichSessoes = async () => {
      try {
        // Correção: getFilmes() e getSalas() já retornam os arrays diretamente agora
        const [filmes, salas] = await Promise.all([getFilmes(), getSalas()]);

        const enriched = sessoes.map((sessao) => ({
          ...sessao,
          filme: filmes.find((f) => f.id === sessao.filmeId),
          sala: salas.find((s) => s.id === sessao.salaId),
        }));
        setSessoesDetalhadas(enriched);
      } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
      }
    };

    if (sessoes.length > 0) {
      enrichSessoes();
    } else {
      setSessoesDetalhadas([]);
    }
  }, [sessoes]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta sessão?')) {
      try {
        await deleteSessao(id);
        onDelete();
      } catch (error) {
        console.error('Erro ao deletar sessão:', error);
        alert('Erro ao deletar sessão.');
      }
    }
  };

  // 4. A REGRA DE COMPRA: Intercepta o clique
  const handleVenderIngresso = (sessao: SessaoComDetalhes) => {
    if (!isAuthenticated) {
      alert('Você precisa estar logado para comprar ingressos!');
      navigate('/login');
      return; // Para a execução aqui, não abre o modal
    }

    // Se estiver logado, segue o fluxo normal
    setSelectedSessao(sessao);
    setModalOpen(true);
  };

  const formatDateTime = (dateStr: string | Date | undefined) => {
    if (!dateStr) return 'Data não disponível';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Data Inválida';
    
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (duracao: string | number | Date | undefined) => {
    if (!duracao) return '0';
    if (typeof duracao === 'number') return String(duracao);
    
    try {
      const date = new Date(duracao);
      if (isNaN(date.getTime())) return String(duracao);
      
      // A duração é salva como 1970-01-01THH:mm:ss.000Z
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      return String(hours * 60 + minutes);
    } catch {
      return String(duracao);
    }
  };

  if (sessoes.length === 0) {
    return (
      <div className="alert alert-secondary text-center">
        <i className="bi bi-calendar-x me-2"></i>
        Nenhuma sessão agendada.
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table table-dark table-hover align-middle">
          <thead className="table-warning">
            <tr>
              <th className="text-dark">
                <i className="bi bi-film me-1"></i>
                Filme
              </th>
              <th className="text-dark">
                <i className="bi bi-door-open me-1"></i>
                Sala
              </th>
              <th className="text-dark">
                <i className="bi bi-calendar me-1"></i>
                Data/Horário
              </th>
              <th className="text-dark text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sessoesDetalhadas.map((sessao) => (
              <tr key={sessao.id}>
                <td>
                  <span className="text-warning fw-bold">
                    {sessao.filme?.titulo || `Filme ID: ${sessao.filmeId}`}
                  </span>
                  {sessao.filme && (
                    <small className="d-block text-secondary">
                      {sessao.filme.genero} • {formatDuration(sessao.filme.duracao)} min
                    </small>
                  )}
                </td>
                <td>
                  <span className="badge bg-secondary">
                    Sala {sessao.sala?.numero || sessao.salaId}
                  </span>
                  {sessao.sala && (
                    <small className="d-block text-secondary">
                      {sessao.sala.capacidade} lugares
                    </small>
                  )}
                </td>
                <td>
                  <i className="bi bi-clock me-1 text-warning"></i>
                  {formatDateTime(sessao.horarioExibicao || sessao.dataHora)}
                </td>
                <td className="text-end">
                  <div className="btn-group gap-1">
                    {/* Botão de comprar: Visível para todos, mas bloqueia quem não tem login */}
                    <button
                      className="btn btn-success btn-sm rounded"
                      onClick={() => handleVenderIngresso(sessao)}
                    >
                      <i className="bi bi-ticket-perforated me-1"></i>
                      Comprar Ingresso
                    </button>
                    
                    {/* 5. A REGRA DE EDIÇÃO: Só mostra para Admin */}
                    {isAdmin && (
                      <>
                        <button
                          className="btn btn-outline-warning btn-sm rounded"
                          onClick={() => onEdit(sessao)}
                          title="Editar Sessão"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm rounded"
                          onClick={() => sessao.id && handleDelete(sessao.id)}
                          title="Excluir Sessão"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PedidoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sessao={selectedSessao}
      />
    </>
  );
};

export default SessoesList;