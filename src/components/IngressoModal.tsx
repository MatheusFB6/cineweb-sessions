import { useState, useEffect } from 'react';
import { SessaoComDetalhes } from '@/types';
import { createIngresso } from '@/services/api';

interface IngressoModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessao: SessaoComDetalhes | null;
}

const PRECO_INTEIRA = 40.0;
const PRECO_MEIA = 20.0;

const IngressoModal = ({ isOpen, onClose, sessao }: IngressoModalProps) => {
  const [tipo, setTipo] = useState<'inteira' | 'meia'>('inteira');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTipo('inteira');
      setSuccess(false);
    }
  }, [isOpen]);

  const valor = tipo === 'inteira' ? PRECO_INTEIRA : PRECO_MEIA;

  const handleSubmit = async () => {
    if (!sessao?.id) return;

    setLoading(true);
    try {
      await createIngresso({
        sessaoId: sessao.id,
        tipo,
        valor,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Erro ao criar ingresso:', error);
      alert('Erro ao criar ingresso. Verifique se o json-server está rodando.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark border border-warning">
          <div className="modal-header bg-warning text-dark border-0">
            <h5 className="modal-title">
              <i className="bi bi-ticket-perforated me-2"></i>
              Venda de Ingresso
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          <div className="modal-body text-light">
            {success ? (
              <div className="text-center py-4">
                <i className="bi bi-check-circle-fill text-success display-1"></i>
                <h4 className="mt-3 text-success">Ingresso Vendido!</h4>
                <p className="text-secondary">
                  {tipo === 'inteira' ? 'Inteira' : 'Meia-entrada'} - R$ {valor.toFixed(2)}
                </p>
              </div>
            ) : (
              <>
                <div className="card bg-secondary border-0 mb-4">
                  <div className="card-body">
                    <h6 className="text-warning mb-2">
                      <i className="bi bi-film me-1"></i>
                      {sessao?.filme?.titulo}
                    </h6>
                    <small className="text-light d-block">
                      <i className="bi bi-door-open me-1"></i>
                      Sala {sessao?.sala?.numero}
                    </small>
                    <small className="text-light d-block">
                      <i className="bi bi-clock me-1"></i>
                      {sessao?.dataHora && new Date(sessao.dataHora).toLocaleString('pt-BR')}
                    </small>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Tipo de Ingresso</label>
                  <div className="row g-3">
                    <div className="col-6">
                      <div
                        className={`card cursor-pointer ${tipo === 'inteira' ? 'border-warning bg-warning bg-opacity-10' : 'border-secondary'}`}
                        onClick={() => setTipo('inteira')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body text-center">
                          <i className="bi bi-ticket fs-2 text-warning"></i>
                          <h6 className="mt-2 mb-1">Inteira</h6>
                          <span className="badge bg-warning text-dark fs-6">
                            R$ {PRECO_INTEIRA.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div
                        className={`card cursor-pointer ${tipo === 'meia' ? 'border-warning bg-warning bg-opacity-10' : 'border-secondary'}`}
                        onClick={() => setTipo('meia')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body text-center">
                          <i className="bi bi-ticket-perforated fs-2 text-info"></i>
                          <h6 className="mt-2 mb-1">Meia-entrada</h6>
                          <span className="badge bg-info text-dark fs-6">
                            R$ {PRECO_MEIA.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="alert alert-warning bg-warning bg-opacity-25 border-warning text-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>
                      <i className="bi bi-receipt me-2"></i>
                      Total a pagar:
                    </span>
                    <span className="fs-4 fw-bold text-warning">R$ {valor.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
          {!success && (
            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-cart-check me-2"></i>
                    Confirmar Venda
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngressoModal;
