/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { api } from '../../services/api';

interface PedidoCompleto {
  id: number;
  qtInteira: number;
  qtMeia: number;
  valorTotal: number;
  userId?: string;
  user?: { id: string; name: string; email: string };
  ingressosInfo?: any[];
  lanchesInfo?: any[];
}

export default function PedidosAdminView() {
  const [pedidos, setPedidos] = useState<PedidoCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pedidos');
      setPedidos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPedidos(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm(`Cancelar e remover o Pedido #${id}?`)) return;
    try {
      await api.delete(`/pedidos/${id}`);
      fetchPedidos();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao remover pedido');
    }
  };

  const totalGeral = pedidos.reduce((a, p) => a + p.valorTotal, 0);

  return (
    <div className="card bg-dark text-light border-secondary">
      <div className="card-header border-secondary d-flex justify-content-between align-items-center py-3">
        <h3 className="mb-0 text-warning">
          <i className="bi bi-cart-fill me-2"></i>Pedidos — Controle Geral
        </h3>
        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-warning text-dark">
            {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''}
          </span>
          <span className="text-warning fw-bold">
            Total: R$ {totalGeral.toFixed(2)}
          </span>
          <button className="btn btn-outline-secondary btn-sm" onClick={fetchPedidos}>
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      </div>

      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="text-secondary mt-3 small">Carregando pedidos...</p>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <i className="bi bi-cart-x fs-1 d-block mb-3 opacity-50"></i>
            <p>Nenhum pedido realizado ainda.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="table-warning text-dark">
                <tr>
                  <th style={{ width: '70px' }}>Pedido</th>
                  <th>Comprador</th>
                  <th style={{ width: '90px' }} className="text-center">Inteiras</th>
                  <th style={{ width: '80px' }} className="text-center">Meias</th>
                  <th>Lanches</th>
                  <th style={{ width: '120px' }} className="text-end">Total</th>
                  <th style={{ width: '100px' }} className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <>
                    <tr
                      key={pedido.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setExpandedId(expandedId === pedido.id ? null : pedido.id)}
                    >
                      <td>
                        <span className="badge bg-warning text-dark fw-bold">#{pedido.id}</span>
                      </td>
                      <td>
                        {pedido.user ? (
                          <div>
                            <div className="fw-semibold">{pedido.user.name}</div>
                            <small className="text-secondary">{pedido.user.email}</small>
                          </div>
                        ) : (
                          <span className="text-secondary fst-italic small">
                            {pedido.userId ? `ID: ${pedido.userId.slice(0, 8)}…` : 'Anônimo'}
                          </span>
                        )}
                      </td>
                      <td className="text-center">
                        <span className="badge bg-secondary">{pedido.qtInteira}</span>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-secondary">{pedido.qtMeia}</span>
                      </td>
                      <td>
                        {pedido.lanchesInfo && pedido.lanchesInfo.length > 0 ? (
                          <span className="small">
                            {pedido.lanchesInfo.map((l: any) => `${l.quantidade}x ${l.nome}`).join(', ')}
                          </span>
                        ) : (
                          <span className="text-secondary small">—</span>
                        )}
                      </td>
                      <td className="text-end fw-bold text-warning">
                        R$ {pedido.valorTotal.toFixed(2)}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-info me-1"
                          title="Ver detalhes"
                          onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === pedido.id ? null : pedido.id); }}
                        >
                          <i className={`bi ${expandedId === pedido.id ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Remover"
                          onClick={(e) => { e.stopPropagation(); handleDelete(pedido.id); }}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                    {expandedId === pedido.id && (
                      <tr key={`${pedido.id}-detail`} className="border-top border-warning">
                        <td colSpan={7} className="bg-black p-3">
                          <div className="row g-3">
                            <div className="col-md-4">
                              <small className="text-warning fw-bold d-block mb-2">
                                <i className="bi bi-person me-1"></i>Comprador
                              </small>
                              {pedido.user ? (
                                <>
                                  <div>{pedido.user.name}</div>
                                  <div className="text-secondary small">{pedido.user.email}</div>
                                  <div className="text-secondary" style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
                                    ID: {pedido.user.id}
                                  </div>
                                </>
                              ) : (
                                <span className="text-secondary">—</span>
                              )}
                            </div>
                            <div className="col-md-4">
                              <small className="text-warning fw-bold d-block mb-2">
                                <i className="bi bi-ticket-perforated me-1"></i>Ingressos ({(pedido.ingressosInfo?.length ?? 0)})
                              </small>
                              {pedido.ingressosInfo && pedido.ingressosInfo.length > 0 ? (
                                pedido.ingressosInfo.map((ing: any, i: number) => (
                                  <div key={i} className="text-secondary small">
                                    Ingresso {ing.tipo} — Sessão #{ing.sessaoId}
                                    <span className="ms-1 text-warning">
                                      (R${ing.valorUnitario})
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <span className="text-secondary small">—</span>
                              )}
                            </div>
                            <div className="col-md-4">
                              <small className="text-warning fw-bold d-block mb-2">
                                <i className="bi bi-cup-straw me-1"></i>Lanches
                              </small>
                              {pedido.lanchesInfo && pedido.lanchesInfo.length > 0 ? (
                                <ul className="list-unstyled mb-0 small">
                                  {pedido.lanchesInfo.map((l: any, i: number) => (
                                    <li key={i} className="d-flex justify-content-between">
                                      <span>{l.quantidade}x {l.nome}</span>
                                      <span className="text-warning ms-2">R$ {l.subtotal.toFixed(2)}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-secondary small">—</span>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
