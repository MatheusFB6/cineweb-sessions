import { useState, useEffect } from 'react';
import { Sessao, SessaoComDetalhes } from '@/types';
import { deleteSessao, getFilmes, getSalas } from '@/services/api';
import PedidoModal from './PedidoModal';

interface SessoesListProps {
  sessoes: Sessao[];
  onDelete: () => void;
  onEdit: (sessao: Sessao) => void;
}

const SessoesList = ({ sessoes, onDelete, onEdit }: SessoesListProps) => {
  const [sessoesDetalhadas, setSessoesDetalhadas] = useState<SessaoComDetalhes[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSessao, setSelectedSessao] = useState<SessaoComDetalhes | null>(null);

  useEffect(() => {
    const enrichSessoes = async () => {
      try {
        const [filmesRes, salasRes] = await Promise.all([getFilmes(), getSalas()]);
        const filmes = filmesRes.data;
        const salas = salasRes.data;

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

  const handleVenderIngresso = (sessao: SessaoComDetalhes) => {
    setSelectedSessao(sessao);
    setModalOpen(true);
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (sessoes.length === 0) {
    return (
      <div className="alert alert-secondary text-center">
        <i className="bi bi-calendar-x me-2"></i>
        Nenhuma sessão agendada. Agende uma sessão usando o formulário acima.
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table table-dark table-hover">
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
                      {sessao.filme.genero} • {sessao.filme.duracao} min
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
                  {formatDateTime(sessao.dataHora)}
                </td>
                <td className="text-end">
                  <div className="btn-group">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleVenderIngresso(sessao)}
                    >
                      <i className="bi bi-ticket-perforated me-1"></i>
                      Vender Ingresso
                    </button>
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => onEdit(sessao)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => sessao.id && handleDelete(sessao.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
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