import { LancheCombo } from '@/types';
import { deleteLanche } from '@/services/api';

interface LanchesListProps {
  lanches: LancheCombo[];
  onDelete: () => void;
  onEdit: (lanche: LancheCombo) => void;
}

const LanchesList = ({ lanches, onDelete, onEdit }: LanchesListProps) => {
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este lanche?')) {
      try {
        await deleteLanche(id);
        onDelete();
      } catch (error) {
        console.error('Erro ao deletar lanche:', error);
        alert('Erro ao deletar lanche.');
      }
    }
  };

  if (lanches.length === 0) {
    return (
      <div className="alert alert-secondary text-center">
        <i className="bi bi-cup-straw me-2"></i>
        Nenhum lanche cadastrado.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-dark table-hover">
        <thead className="table-warning">
          <tr>
            <th className="text-dark">Nome</th>
            <th className="text-dark">Descrição</th>
            <th className="text-dark">Valor (R$)</th>
            <th className="text-dark">Estoque</th>
            <th className="text-dark text-end">Ações</th>
          </tr>
        </thead>
        <tbody>
          {lanches.map((lanche) => (
            <tr key={lanche.id}>
              <td>{lanche.nome}</td>
              <td className="text-secondary">{lanche.descricao}</td>
              <td className="text-warning fw-bold">R$ {lanche.valorUnitario.toFixed(2)}</td>
              <td>{lanche.qtUnidade}</td>
              <td className="text-end">
                <div className="btn-group">
                  <button className="btn btn-outline-warning btn-sm" onClick={() => onEdit(lanche)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => lanche.id && handleDelete(lanche.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LanchesList;