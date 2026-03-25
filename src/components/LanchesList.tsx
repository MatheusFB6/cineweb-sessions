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
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
      {lanches.map((lanche) => (
        <div className="col" key={lanche.id}>
          <div className="card h-100 bg-dark border-secondary text-light">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="card-title text-warning mb-0">{lanche.nome}</h5>
                <span className="badge bg-success">
                  R$ {Number(lanche.valorUnitario).toFixed(2)}
                </span>
              </div>
              {lanche.descricao && (
                <p className="card-text small text-secondary mb-3">
                  {lanche.descricao}
                </p>
              )}
              <div className="mt-auto">
                <small className="text-muted d-block mb-3">
                  Quantidade disponível: {lanche.qtUnidade}
                </small>
                
                {/* Botão visível a todos, mas protegido pela função de clique */}
                <button
                  className="btn btn-success btn-sm w-100 mb-2"
                  onClick={() => handleComprarLanche(lanche)}
                >
                  <i className="bi bi-cart-plus me-1"></i>
                  Comprar
                </button>

                {/* Botões de gestão escondidos dos utilizadores comuns */}
                {isAdmin && (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-warning btn-sm w-50"
                      onClick={() => onEdit(lanche)}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Editar
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm w-50"
                      onClick={() => lanche.id && handleDelete(lanche.id)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LanchesList;