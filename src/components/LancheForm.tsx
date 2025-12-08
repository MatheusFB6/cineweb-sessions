import { useState, useEffect } from 'react';
import { lancheSchema } from '@/schemas/validation';
import { createLanche, updateLanche } from '@/services/api';
import { LancheCombo } from '@/types';

interface LancheFormProps {
  onSuccess: () => void;
  lancheEditando: LancheCombo | null;
  onCancel: () => void;
}

const LancheForm = ({ onSuccess, lancheEditando, onCancel }: LancheFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valorUnitario: '',
    qtUnidade: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lancheEditando) {
      setFormData({
        nome: lancheEditando.nome,
        descricao: lancheEditando.descricao,
        valorUnitario: String(lancheEditando.valorUnitario),
        qtUnidade: String(lancheEditando.qtUnidade),
      });
    } else {
      setFormData({ nome: '', descricao: '', valorUnitario: '', qtUnidade: '' });
    }
  }, [lancheEditando]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const dataToValidate = {
      nome: formData.nome,
      descricao: formData.descricao,
      valorUnitario: Number(formData.valorUnitario),
      qtUnidade: Number(formData.qtUnidade),
    };

    const result = lancheSchema.safeParse(dataToValidate);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) newErrors[err.path[0] as string] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      if (lancheEditando && lancheEditando.id) {
        await updateLanche({ ...result.data, subtotal: 0, id: lancheEditando.id } as LancheCombo);
      } else {
        await createLanche({ ...result.data, subtotal: 0 } as Omit<LancheCombo, 'id'>);
      }
      setFormData({ nome: '', descricao: '', valorUnitario: '', qtUnidade: '' });
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar lanche:', error);
      alert('Erro ao salvar lanche.');
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
          <button type="button" className="btn btn-sm btn-outline-dark" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Nome *</label>
              <input
                type="text"
                name="nome"
                className={`form-control bg-secondary text-light border-0 ${errors.nome ? 'is-invalid' : ''}`}
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Pipoca Média"
              />
              {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Descrição *</label>
              <input
                type="text"
                name="descricao"
                className={`form-control bg-secondary text-light border-0 ${errors.descricao ? 'is-invalid' : ''}`}
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Ex: Salgada na manteiga"
              />
              {errors.descricao && <div className="invalid-feedback">{errors.descricao}</div>}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Valor Unitário (R$) *</label>
              <input
                type="number"
                step="0.01"
                name="valorUnitario"
                className={`form-control bg-secondary text-light border-0 ${errors.valorUnitario ? 'is-invalid' : ''}`}
                value={formData.valorUnitario}
                onChange={handleChange}
              />
              {errors.valorUnitario && <div className="invalid-feedback">{errors.valorUnitario}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Qtd. Estoque *</label>
              <input
                type="number"
                name="qtUnidade"
                className={`form-control bg-secondary text-light border-0 ${errors.qtUnidade ? 'is-invalid' : ''}`}
                value={formData.qtUnidade}
                onChange={handleChange}
              />
              {errors.qtUnidade && <div className="invalid-feedback">{errors.qtUnidade}</div>}
            </div>
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-warning" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check-lg me-2"></i>}
              {lancheEditando ? 'Salvar' : 'Cadastrar'}
            </button>
            {lancheEditando && (
              <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LancheForm;