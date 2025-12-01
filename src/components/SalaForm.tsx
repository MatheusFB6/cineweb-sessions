import { useState } from 'react';
import { salaSchema } from '@/schemas/validation';
import { createSala } from '@/services/api';
import { Sala } from '@/types';

interface SalaFormProps {
  onSuccess: () => void;
}

const SalaForm = ({ onSuccess }: SalaFormProps) => {
  const [formData, setFormData] = useState({
    numero: '',
    capacidade: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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
      await createSala(result.data as Omit<Sala, 'id'>);
      setFormData({ numero: '', capacidade: '' });
      onSuccess();
    } catch (error) {
      console.error('Erro ao cadastrar sala:', error);
      alert('Erro ao cadastrar sala. Verifique se o json-server está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-dark border-secondary">
      <div className="card-header bg-warning text-dark">
        <h5 className="mb-0">
          <i className="bi bi-plus-circle me-2"></i>
          Cadastrar Sala
        </h5>
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

          <button type="submit" className="btn btn-warning" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Cadastrando...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg me-2"></i>
                Cadastrar Sala
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SalaForm;
