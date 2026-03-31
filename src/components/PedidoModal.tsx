import { useState, useEffect } from 'react';
import { LancheCombo } from '@/types';
import { createPedido, getLancheCombos as getLanches, api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface SessaoInfo {
  id?: number;
  horarioExibicao?: string | Date;
  filme?: { titulo: string };
  sala?: { numero: number };
}

interface PedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessao: SessaoInfo | null;
}

const PRECO_INTEIRA = 40.0;
const PRECO_MEIA = 20.0;

const PedidoModal = ({ isOpen, onClose, sessao }: PedidoModalProps) => {
  const { user } = useAuth();
  const [qtInteira, setQtInteira] = useState(0);
  const [qtMeia, setQtMeia] = useState(0);
  const [lanchesDisponiveis, setLanchesDisponiveis] = useState<LancheCombo[]>([]);
  const [lanchesSelecionados, setLanchesSelecionados] = useState<{ lanche: LancheCombo; qtd: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQtInteira(0);
      setQtMeia(0);
      setLanchesSelecionados([]);
      setSuccess(false);
      setError('');
      loadLanches();
    }
  }, [isOpen]);

  const loadLanches = async () => {
    try {
      const data = await getLanches();
      setLanchesDisponiveis(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLanche = (lanche: LancheCombo) => {
    setLanchesSelecionados((prev) => {
      const existing = prev.find((item) => item.lanche.id === lanche.id);
      if (existing) {
        return prev.map((item) =>
          item.lanche.id === lanche.id ? { ...item, qtd: item.qtd + 1 } : item
        );
      }
      return [...prev, { lanche, qtd: 1 }];
    });
  };

  const handleRemoveLanche = (lancheId: number) => {
    setLanchesSelecionados((prev) => prev.filter((item) => item.lanche.id !== lancheId));
  };

  const totalIngressos = qtInteira * PRECO_INTEIRA + qtMeia * PRECO_MEIA;
  const totalLanches = lanchesSelecionados.reduce(
    (acc, item) => acc + item.lanche.valorUnitario * item.qtd,
    0
  );
  const valorTotal = totalIngressos + totalLanches;

  const handleSubmit = async () => {
    if (!sessao?.id) return;
    if (qtInteira === 0 && qtMeia === 0) {
      setError('Selecione ao menos 1 ingresso.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // 1. Prepara os dados do JSON
      const ingressosInfo = [];
      if (qtInteira > 0) {
        ingressosInfo.push({ tipo: 'Inteira', qtd: qtInteira, valorUnitario: PRECO_INTEIRA, sessaoId: sessao.id });
      }
      if (qtMeia > 0) {
        ingressosInfo.push({ tipo: 'Meia', qtd: qtMeia, valorUnitario: PRECO_MEIA, sessaoId: sessao.id });
      }

      const lanchesInfo = lanchesSelecionados.map((item) => ({
        id: item.lanche.id,
        nome: item.lanche.nome,
        valorUnitario: item.lanche.valorUnitario,
        quantidade: item.qtd,
        subtotal: item.lanche.valorUnitario * item.qtd,
      }));

      // 2. Envia requisição única criando o Pedido com a "foto" dos itens
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await createPedido({
        qtInteira,
        qtMeia,
        valorTotal,
        userId: user?.id,
        ingressosInfo,
        lanchesInfo,
      } as any);

      setSuccess(true);
      setTimeout(() => onClose(), 2500);
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      setError('Erro ao processar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content bg-dark border border-warning">
          <div className="modal-header bg-warning text-dark border-0">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-cart-fill me-2"></i>Comprar Ingressos
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading}></button>
          </div>

          <div className="modal-body text-light">
            {success ? (
              <div className="text-center py-5">
                <i className="bi bi-check-circle-fill text-success display-1"></i>
                <h4 className="mt-3 text-success fw-bold">Pedido Realizado!</h4>
                <p className="text-secondary">Seus ingressos foram reservados com sucesso.</p>
              </div>
            ) : (
              <div className="row">
                {/* Esquerda */}
                <div className="col-md-7 border-end border-secondary pe-4">
                  {/* Sessão */}
                  {sessao && (
                    <div className="card bg-secondary bg-opacity-25 border-secondary mb-4 p-3">
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-camera-reels-fill text-warning fs-4"></i>
                        <div>
                          <div className="fw-bold">{sessao.filme?.titulo ?? 'Sessão'}</div>
                          <small className="text-secondary">
                            Sala {sessao.sala?.numero} •{' '}
                            {sessao.horarioExibicao && new Date(sessao.horarioExibicao).toLocaleString('pt-BR')}
                          </small>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ingressos */}
                  <h6 className="text-warning mb-3">
                    <i className="bi bi-ticket-perforated me-2"></i>Ingressos
                  </h6>
                  <div className="d-flex justify-content-between align-items-center mb-3 p-2 border border-secondary rounded">
                    <div>
                      <span className="fw-semibold">Inteira</span>
                      <span className="text-warning ms-2">R$ {PRECO_INTEIRA.toFixed(2)}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-sm btn-outline-warning" onClick={() => setQtInteira(Math.max(0, qtInteira - 1))}>−</button>
                      <span className="fw-bold px-2">{qtInteira}</span>
                      <button className="btn btn-sm btn-outline-warning" onClick={() => setQtInteira(qtInteira + 1)}>+</button>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-4 p-2 border border-secondary rounded">
                    <div>
                      <span className="fw-semibold">Meia-entrada</span>
                      <span className="text-warning ms-2">R$ {PRECO_MEIA.toFixed(2)}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-sm btn-outline-warning" onClick={() => setQtMeia(Math.max(0, qtMeia - 1))}>−</button>
                      <span className="fw-bold px-2">{qtMeia}</span>
                      <button className="btn btn-sm btn-outline-warning" onClick={() => setQtMeia(qtMeia + 1)}>+</button>
                    </div>
                  </div>

                  {/* Lanches */}
                  <h6 className="text-warning mb-3">
                    <i className="bi bi-cup-straw me-2"></i>Bomboniere
                  </h6>
                  {lanchesDisponiveis.length === 0 ? (
                    <p className="text-secondary small">Nenhum produto disponível no momento.</p>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {lanchesDisponiveis.map((lanche) => (
                        <button
                          key={lanche.id}
                          type="button"
                          className="btn btn-outline-secondary text-start d-flex justify-content-between align-items-center"
                          onClick={() => handleAddLanche(lanche)}
                        >
                          <div>
                            <div className="fw-semibold text-light">{lanche.nome}</div>
                            {lanche.descricao && <small className="text-secondary">{lanche.descricao}</small>}
                          </div>
                          <span className="badge bg-warning text-dark ms-2">
                            + R$ {lanche.valorUnitario.toFixed(2)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direita — Resumo */}
                <div className="col-md-5 ps-4">
                  <h6 className="text-warning mb-3">
                    <i className="bi bi-receipt me-2"></i>Resumo
                  </h6>

                  <ul className="list-unstyled small mb-3">
                    {qtInteira > 0 && (
                      <li className="d-flex justify-content-between mb-1">
                        <span>{qtInteira}x Inteira</span>
                        <span className="text-warning">R$ {(qtInteira * PRECO_INTEIRA).toFixed(2)}</span>
                      </li>
                    )}
                    {qtMeia > 0 && (
                      <li className="d-flex justify-content-between mb-1">
                        <span>{qtMeia}x Meia</span>
                        <span className="text-warning">R$ {(qtMeia * PRECO_MEIA).toFixed(2)}</span>
                      </li>
                    )}
                    {lanchesSelecionados.map((item, idx) => (
                      <li key={idx} className="d-flex justify-content-between align-items-center mb-1">
                        <span>{item.qtd}x {item.lanche.nome}</span>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-warning">R$ {(item.qtd * item.lanche.valorUnitario).toFixed(2)}</span>
                          <button className="btn btn-link text-danger p-0" onClick={() => handleRemoveLanche(item.lanche.id!)}>
                            <i className="bi bi-x-circle"></i>
                          </button>
                        </div>
                      </li>
                    ))}
                    {qtInteira === 0 && qtMeia === 0 && lanchesSelecionados.length === 0 && (
                      <li className="text-secondary text-center py-3">Nenhum item selecionado</li>
                    )}
                  </ul>

                  <hr className="border-secondary" />

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold">Total</span>
                    <span className="fs-4 fw-bold text-warning">R$ {valorTotal.toFixed(2)}</span>
                  </div>

                  {error && (
                    <div className="alert alert-danger border-danger bg-dark text-danger small p-2 mb-3">
                      <i className="bi bi-exclamation-triangle me-1"></i>{error}
                    </div>
                  )}

                  <button
                    className="btn btn-success w-100 py-2 fw-bold"
                    onClick={handleSubmit}
                    disabled={loading || valorTotal === 0}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Processando...</>
                    ) : (
                      <><i className="bi bi-check-circle me-2"></i>Finalizar Pedido</>
                    )}
                  </button>

                  {user && (
                    <p className="text-center text-secondary small mt-2">
                      <i className="bi bi-person me-1"></i>Comprando como <strong className="text-warning">{user.name}</strong>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoModal;