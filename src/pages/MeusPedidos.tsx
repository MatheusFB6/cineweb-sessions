import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Navigate } from 'react-router-dom';

interface LancheItem {
  nome: string;
  quantidade: number;
  valorUnitario: number;
}

interface Comprador {
  id: string;
  name: string;
  email: string;
}

interface PedidoCompleto {
  id: number;
  qtInteira: number;
  qtMeia: number;
  valorTotal: number;
  userId?: string;
  user?: Comprador;
  ingressosInfo?: any[];
  lanchesInfo?: any[];
}

export default function MeusPedidos() {
  const { user, isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState<PedidoCompleto[]>([]);
  const [loading, setLoading] = useState(true);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!user?.id) return;
    api
      .get(`/pedidos/user/${user.id}`)
      .then((res) => setPedidos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-bag-heart-fill text-warning display-5 me-3"></i>
        <div>
          <h1 className="text-light mb-0">Meus Pedidos</h1>
          <p className="text-secondary mb-0">Histórico de compras de {user?.name}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status"></div>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="text-center py-5 text-secondary">
          <i className="bi bi-bag-x fs-1 d-block mb-3 opacity-50"></i>
          <p className="fs-5">Você ainda não realizou nenhum pedido.</p>
          <a href="/sessoes" className="btn btn-outline-warning">
            <i className="bi bi-camera-reels me-2"></i>Ver Sessões em Cartaz
          </a>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="card bg-dark border-secondary">
              <div className="card-header border-secondary d-flex justify-content-between align-items-center">
                <span className="fw-bold text-warning">
                  <i className="bi bi-receipt me-2"></i>Pedido #{pedido.id}
                </span>
                <span className="badge bg-warning text-dark fs-6">
                  R$ {pedido.valorTotal.toFixed(2)}
                </span>
              </div>
              <div className="card-body text-light">
                <div className="row g-3">
                  {/* Ingressos */}
                  <div className="col-md-4">
                    <small className="text-secondary d-block mb-1">
                      <i className="bi bi-ticket-perforated me-1"></i>Ingressos
                    </small>
                    {pedido.qtInteira > 0 && (
                      <div>{pedido.qtInteira}x Inteira</div>
                    )}
                    {pedido.qtMeia > 0 && (
                      <div>{pedido.qtMeia}x Meia-entrada</div>
                    )}
                    {pedido.qtInteira === 0 && pedido.qtMeia === 0 && (
                      <span className="text-secondary">—</span>
                    )}
                  </div>

                  {/* Lanches */}
                  <div className="col-md-4">
                    <small className="text-secondary d-block mb-1">
                      <i className="bi bi-cup-straw me-1"></i>Bomboniere
                    </small>
                    {pedido.lanchesInfo && pedido.lanchesInfo.length > 0 ? (
                      pedido.lanchesInfo.map((l, i) => (
                        <div key={i}>{l.quantidade}x {l.nome}</div>
                      ))
                    ) : (
                      <span className="text-secondary">Nenhum lanche</span>
                    )}
                  </div>

                  {/* Subtotais */}
                  <div className="col-md-4 text-end">
                    <small className="text-secondary d-block mb-1">Valores</small>
                    <div>
                      Ingressos: <span className="text-warning">
                        R$ {(pedido.qtInteira * 40 + pedido.qtMeia * 20).toFixed(2)}
                      </span>
                    </div>
                    {pedido.lanchesInfo && pedido.lanchesInfo.length > 0 && (
                      <div>
                        Lanches: <span className="text-warning">
                          R$ {pedido.lanchesInfo.reduce((a, l) => a + l.valorUnitario * l.quantidade, 0).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
