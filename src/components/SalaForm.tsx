import { useState, useEffect } from 'react';
import { createSala, updateSala } from '@/services/api';
import { Sala } from '@/types';

interface SalaFormProps {
  onSuccess: () => void;
  salaEditando: Sala | null;
  onCancel: () => void;
}

const SalaForm = ({ onSuccess, salaEditando, onCancel }: SalaFormProps) => {
  const empty = { numero: '', capacidade: '', cinemaId: '' };
  const [formData, setFormData] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (salaEditando) {
      setFormData({
        numero: String(salaEditando.numero ?? ''),
        capacidade: String(salaEditando.capacidade ?? ''),
        cinemaId: String((salaEditando as any).cinemaId ?? ''),
      });
    } else {
      setFormData(empty);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salaEditando]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.numero || Number(formData.numero) <= 0) errs.numero = 'Número da sala obrigatório';
    if (!formData.capacidade || Number(formData.capacidade) <= 0) errs.capacidade = 'Capacidade obrigatória';
    if (!formData.cinemaId) errs.cinemaId = 'ID do Cinema obrigatório';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      numero: Number(formData.numero),
      capacidade: Number(formData.capacidade),
      cinemaId: Number(formData.cinemaId),
    };

    setLoading(true);
    try {
      if (salaEditando?.id) {
        await updateSala(salaEditando.id, payload as Partial<Sala>);
      } else {
        await createSala(payload as Omit<Sala, 'id'>);
      }
      setFormData(empty);
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar sala:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-dark border-secondary">
      <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className={`bi ${salaEditando ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
          {salaEditando ? 'Editar Sala' : 'Cadastrar Sala'}
        </h5>
        {salaEditando && (
          <button type="button" className="btn btn-sm btn-outline-dark" onClick={onCancel}>Cancelar</button>
        )}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label text-light">Número da Sala *</label>
              <input type="number" name="numero" min="1" className={`form-control bg-secondary text-light border-0 ${errors.numero ? 'is-invalid' : ''}`} value={formData.numero} onChange={handleChange} placeholder="Ex: 1" />
              {errors.numero && <div className="invalid-feedback">{errors.numero}</div>}
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label text-light">Capacidade *</label>
              <input type="number" name="capacidade" min="1" className={`form-control bg-secondary text-light border-0 ${errors.capacidade ? 'is-invalid' : ''}`} value={formData.capacidade} onChange={handleChange} placeholder="Ex: 100" />
              {errors.capacidade && <div className="invalid-feedback">{errors.capacidade}</div>}
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label text-light">ID do Cinema *</label>
              <input type="number" name="cinemaId" min="1" className={`form-control bg-secondary text-light border-0 ${errors.cinemaId ? 'is-invalid' : ''}`} value={formData.cinemaId} onChange={handleChange} placeholder="Ex: 1" />
              {errors.cinemaId && <div className="invalid-feedback">{errors.cinemaId}</div>}
            </div>
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-warning" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check-lg me-2"></i>}
              {salaEditando ? 'Salvar Alterações' : 'Cadastrar Sala'}
            </button>
            {salaEditando && (
              <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancelar</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaForm;