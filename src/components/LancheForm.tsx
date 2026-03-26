import { useState, useEffect } from 'react';
import { createLanche, updateLanche } from '@/services/api';
import { LancheCombo } from '@/types';

interface LancheFormProps {
  onSuccess: () => void;
  lancheEditando: LancheCombo | null;
  onCancel: () => void;
}

const LancheForm = ({ onSuccess, lancheEditando, onCancel }: LancheFormProps) => {
  const empty = { nome: '', descricao: '', valorUnitario: '', quantidade: '' };
  const [formData, setFormData] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lancheEditando) {
      setFormData({
        nome: lancheEditando.nome ?? '',
        descricao: lancheEditando.descricao ?? '',
        valorUnitario: String(lancheEditando.valorUnitario ?? ''),
        quantidade: String(lancheEditando.quantidade ?? ''),
      });
    } else {
      setFormData(empty);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lancheEditando]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.nome.trim()) errs.nome = 'Nome obrigatório';
    if (!formData.valorUnitario || Number(formData.valorUnitario) <= 0) errs.valorUnitario = 'Valor obrigatório';
    if (!formData.quantidade || Number(formData.quantidade) <= 0) errs.quantidade = 'Quantidade obrigatória';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const valorUnitario = Number(formData.valorUnitario);
    const quantidade = Number(formData.quantidade);
    const subtotal = valorUnitario * quantidade;

    const payload = {
      nome: formData.nome,
      descricao: formData.descricao || undefined,
      valorUnitario,
      quantidade,
      subtotal,
    };

    setLoading(true);
    try {
      if (lancheEditando?.id) {
        await updateLanche(lancheEditando.id, payload as Partial<LancheCombo>);
      } else {
        await createLanche(payload as Omit<LancheCombo, 'id'>);
      }
      setFormData(empty);
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar lanche:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-dark border-secondary">
      <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className={`bi ${lancheEditando ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
          {lancheEditando ? 'Editar Lanche' : 'Cadastrar Lanche'}
        </h5>
        {lancheEditando && (
          <button type="button" className="btn btn-sm btn-outline-dark" onClick={onCancel}>Cancelar</button>
        )}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Nome *</label>
              <input type="text" name="nome" className={`form-control bg-secondary text-light border-0 ${errors.nome ? 'is-invalid' : ''}`} value={formData.nome} onChange={handleChange} placeholder="Ex: Pipoca Média" />
              {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Descrição</label>
              <input type="text" name="descricao" className="form-control bg-secondary text-light border-0" value={formData.descricao} onChange={handleChange} placeholder="Ex: Salgada na manteiga" />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Valor Unitário (R$) *</label>
              <input type="number" step="0.01" min="0.01" name="valorUnitario" className={`form-control bg-secondary text-light border-0 ${errors.valorUnitario ? 'is-invalid' : ''}`} value={formData.valorUnitario} onChange={handleChange} />
              {errors.valorUnitario && <div className="invalid-feedback">{errors.valorUnitario}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Quantidade em Estoque *</label>
              <input type="number" min="1" name="quantidade" className={`form-control bg-secondary text-light border-0 ${errors.quantidade ? 'is-invalid' : ''}`} value={formData.quantidade} onChange={handleChange} />
              {errors.quantidade && <div className="invalid-feedback">{errors.quantidade}</div>}
              {formData.valorUnitario && formData.quantidade && (
                <small className="text-warning">
                  Subtotal: R$ {(Number(formData.valorUnitario) * Number(formData.quantidade)).toFixed(2)}
                </small>
              )}
            </div>
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-warning" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check-lg me-2"></i>}
              {lancheEditando ? 'Salvar' : 'Cadastrar'}
            </button>
            {lancheEditando && (
              <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancelar</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LancheForm;