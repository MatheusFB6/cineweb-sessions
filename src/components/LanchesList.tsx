import { LancheCombo as Lanche } from '@/types';
import { deleteLanche } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface LanchesListProps {
  lanches: Lanche[];
  onDelete: () => void;
  onEdit: (lanche: Lanche) => void;
}

const LanchesList = ({ lanches, onDelete, onEdit }: LanchesListProps) => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await deleteLanche(id);
        onDelete();
      } catch (error) {
        console.error('Erro ao deletar lanche:', error);
        alert('Erro ao deletar lanche.');
      }
    }
  };

  // REGRA DE COMPRA: Redireciona para o login se não estiver autenticado
  const handleComprarLanche = (lanche: Lanche) => {
    if (!isAuthenticated) {
      alert('Precisa de iniciar sessão para comprar na bomboniere!');
      navigate('/login');
      return;
    }
    
    // AQUI ENTRA A SUA LÓGICA DE ABRIR MODAL OU ADICIONAR AO CARRINHO
    alert(`Lanche ${lanche.nome} selecionado! (Implementar lógica do carrinho)`);
  };

  if (lanches.length === 0) {
    return (
      <div className="alert alert-secondary text-center">
        <i className="bi bi-cup-straw me-2"></i>
        Nenhum produto cadastrado na bomboniere.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-dark table-striped table-hover align-middle border-secondary">
        <thead className="text-warning">
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Valor Unit. (R$)</th>
            <th>Qtd. Estoque</th>
            <th>Subtotal (R$)</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {lanches.map((lanche) => (
            <tr key={lanche.id}>
              <td className="fw-bold">{lanche.nome}</td>
              <td className="text-secondary small">{lanche.descricao || '—'}</td>
              <td>{Number(lanche.valorUnitario).toFixed(2)}</td>
              <td>{lanche.quantidade}</td>
              <td>{Number(lanche.subtotal).toFixed(2)}</td>
              <td>
                <div className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleComprarLanche(lanche)}
                  >
                    <i className="bi bi-cart-plus me-1"></i>
                    Comprar
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        className="btn btn-outline-warning btn-sm"
                        onClick={() => onEdit(lanche)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => lanche.id && handleDelete(lanche.id)}
                        title="Excluir"
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
  );
};

export default LanchesList;