import { useState, useEffect } from 'react';
import { salaSchema } from '@/schemas/validation';
import { createSala, updateSala } from '@/services/api';
import { Sala } from '@/types';

interface SalaFormProps {
  onSuccess: () => void;
  salaEditando: Sala | null;
  onCancel: () => void;
}

const SalaForm = ({ onSuccess, salaEditando, onCancel }: SalaFormProps) => {
  const [formData, setFormData] = useState({
    numero: '',
    capacidade: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (salaEditando) {
      setFormData({
        numero: String(salaEditando.numero),
        capacidade: String(salaEditando.capacidade),
      });
    } else {
      setFormData({ numero: '', capacidade: '' });
    }
  }, [salaEditando]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const dataToValidate = {
      numero: Number(formData.numero),
      capacidade: Number(formData.capacidade),
    };

    const result = salaSchema.safeParse(dataToValidate);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      if (salaEditando && salaEditando.id) {
        await updateSala({ ...result.data, id: salaEditando.id } as Sala);
      } else {
        await createSala(result.data as Omit<Sala, 'id'>);
      }
      setFormData({ numero: '', capacidade: '' });
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar sala:', error);
      alert('Erro ao salvar sala. Verifique se o json-server está rodando.');
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
          <button type="button" className="btn btn-sm btn-outline-dark" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Número da Sala *</label>
              <input
                type="number"
                name="numero"
                className={`form-control bg-secondary text-light border-0 ${errors.numero ? 'is-invalid' : ''}`}
                value={formData.numero}
                onChange={handleChange}
                placeholder="Ex: 1"
              />
              {errors.numero && <div className="invalid-feedback">{errors.numero}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Capacidade *</label>
              <input
                type="number"
                name="capacidade"
                className={`form-control bg-secondary text-light border-0 ${errors.capacidade ? 'is-invalid' : ''}`}
                value={formData.capacidade}
                onChange={handleChange}
                placeholder="Ex: 100"
              />
              {errors.capacidade && <div className="invalid-feedback">{errors.capacidade}</div>}
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-warning" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-2"></i>
                  {salaEditando ? 'Salvar Alterações' : 'Cadastrar Sala'}
                </>
              )}
            </button>
            {salaEditando && (
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

export default SalaForm;