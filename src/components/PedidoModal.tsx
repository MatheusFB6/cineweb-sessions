import { useState, useEffect } from 'react';
import { SessaoComDetalhes, LancheCombo, Pedido, Ingresso } from '@/types';
import { createPedido, getLanches } from '@/services/api';

interface PedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessao: SessaoComDetalhes | null;
}

const PRECO_INTEIRA = 40.0;
const PRECO_MEIA = 20.0;

const PedidoModal = ({ isOpen, onClose, sessao }: PedidoModalProps) => {
  const [qtInteira, setQtInteira] = useState(0);
  const [qtMeia, setQtMeia] = useState(0);
  const [lanchesDisponiveis, setLanchesDisponiveis] = useState<LancheCombo[]>([]);
  const [lanchesSelecionados, setLanchesSelecionados] = useState<{ lanche: LancheCombo; qtd: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQtInteira(0);
      setQtMeia(0);
      setLanchesSelecionados([]);
      setSuccess(false);
      loadLanches();
    }
  }, [isOpen]);

  const loadLanches = async () => {
    try {
      const res = await getLanches();
      setLanchesDisponiveis(res.data);
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

  // Cálculos
  const totalIngressos = qtInteira * PRECO_INTEIRA + qtMeia * PRECO_MEIA;
  const totalLanches = lanchesSelecionados.reduce((acc, item) => acc + (item.lanche.valorUnitario * item.qtd), 0);
  const valorTotal = totalIngressos + totalLanches;

  const handleSubmit = async () => {
    if (!sessao?.id) return;
    setLoading(true);

    try {
      // Montar lista de objetos Ingresso conforme diagrama
      const listaIngressos: Ingresso[] = [];
      for (let i = 0; i < qtInteira; i++) {
        listaIngressos.push({ sessaoId: sessao.id!, tipo: 'inteira', valor: PRECO_INTEIRA });
      }
      for (let i = 0; i < qtMeia; i++) {
        listaIngressos.push({ sessaoId: sessao.id!, tipo: 'meia', valor: PRECO_MEIA });
      }

      // Montar lista de Lanches conforme diagrama (Agregados ao pedido)
      // Aqui simplificamos: criamos um objeto LancheCombo para cada unidade comprada para ficar na lista do Pedido
      const listaLanchesPedido: LancheCombo[] = [];
      lanchesSelecionados.forEach(item => {
        for(let i=0; i < item.qtd; i++) {
           // Copia o lanche e ajusta subtotal e unidade para representar o item no pedido
           listaLanchesPedido.push({
             ...item.lanche,
             qtUnidade: 1, 
             subtotal: item.lanche.valorUnitario
           });
        }
      });

      const novoPedido: Omit<Pedido, 'id'> = {
        qtInteira,
        qtMeia,
        ingressos: listaIngressos,
        lanches: listaLanchesPedido,
        valorTotal
      };

      await createPedido(novoPedido);
      setSuccess(true);
      setTimeout(() => onClose(), 2000);

    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      alert('Erro ao processar pedido.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content bg-dark border border-warning">
          <div className="modal-header bg-warning text-dark border-0">
            <h5 className="modal-title"><i className="bi bi-cart me-2"></i>Novo Pedido</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading}></button>
          </div>
          <div className="modal-body text-light">
            {success ? (
              <div className="text-center py-5">
                <i className="bi bi-check-circle-fill text-success display-1"></i>
                <h4 className="mt-3 text-success">Pedido Realizado com Sucesso!</h4>
              </div>
            ) : (
              <div className="row">
                {/* Coluna Esquerda: Ingressos e Lanches */}
                <div className="col-md-7 border-end border-secondary">
                  <h6 className="text-warning mb-3">1. Selecione os Ingressos</h6>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Inteira (R$ {PRECO_INTEIRA})</span>
                    <input type="number" min="0" className="form-control w-25 bg-secondary text-light border-0" value={qtInteira} onChange={(e) => setQtInteira(Number(e.target.value))} />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span>Meia (R$ {PRECO_MEIA})</span>
                    <input type="number" min="0" className="form-control w-25 bg-secondary text-light border-0" value={qtMeia} onChange={(e) => setQtMeia(Number(e.target.value))} />
                  </div>

                  <h6 className="text-warning mb-3">2. Adicionar Lanches</h6>
                  <div className="list-group mb-3">
                    {lanchesDisponiveis.map(lanche => (
                      <button key={lanche.id} type="button" className="list-group-item list-group-item-action bg-secondary text-light border-dark d-flex justify-content-between align-items-center" onClick={() => handleAddLanche(lanche)}>
                        <div>
                          <strong>{lanche.nome}</strong>
                          <small className="d-block text-light opacity-75">{lanche.descricao}</small>
                        </div>
                        <span className="badge bg-warning text-dark">R$ {lanche.valorUnitario.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coluna Direita: Resumo */}
                <div className="col-md-5">
                  <h6 className="text-warning mb-3">Resumo do Pedido</h6>
                  <div className="card bg-secondary border-0 mb-3">
                    <div className="card-body p-2">
                      <small className="d-block"><strong>Filme:</strong> {sessao?.filme?.titulo}</small>
                      <small className="d-block"><strong>Sala:</strong> {sessao?.sala?.numero}</small>
                      <small className="d-block"><strong>Data:</strong> {sessao?.dataHora && new Date(sessao.dataHora).toLocaleString('pt-BR')}</small>
                    </div>
                  </div>

                  <ul className="list-group list-group-flush bg-transparent small mb-3">
                    {qtInteira > 0 && <li className="list-group-item bg-transparent text-light d-flex justify-content-between"><span>{qtInteira}x Inteira</span> <span>R$ {(qtInteira * PRECO_INTEIRA).toFixed(2)}</span></li>}
                    {qtMeia > 0 && <li className="list-group-item bg-transparent text-light d-flex justify-content-between"><span>{qtMeia}x Meia</span> <span>R$ {(qtMeia * PRECO_MEIA).toFixed(2)}</span></li>}
                    {lanchesSelecionados.map((item, idx) => (
                      <li key={idx} className="list-group-item bg-transparent text-light d-flex justify-content-between align-items-center">
                        <span>{item.qtd}x {item.lanche.nome}</span>
                        <div>
                           <span className="me-2">R$ {(item.qtd * item.lanche.valorUnitario).toFixed(2)}</span>
                           <i className="bi bi-x-circle text-danger cursor-pointer" style={{cursor: 'pointer'}} onClick={() => handleRemoveLanche(item.lanche.id!)}></i>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="alert alert-warning bg-warning bg-opacity-25 border-warning text-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Total:</span>
                      <span className="fs-4 fw-bold text-warning">R$ {valorTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button className="btn btn-success w-100 py-2" onClick={handleSubmit} disabled={loading || valorTotal === 0}>
                    {loading ? 'Processando...' : <><i className="bi bi-check-circle me-2"></i> Finalizar Pedido</>}
                  </button>
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