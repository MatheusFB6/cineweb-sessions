import { useState, useEffect } from 'react';
import { createSessao, updateSessao, getFilmes, getSalas } from '@/services/api';
import { Filme, Sala, Sessao } from '@/types';

interface SessaoFormProps {
  onSuccess: () => void;
  sessaoEditando: Sessao | null;
  onCancel: () => void;
}

const SessaoForm = ({ onSuccess, sessaoEditando, onCancel }: SessaoFormProps) => {
  const empty = { filmeId: '', salaId: '', cinemaId: '', horarioExibicao: '' };
  const [formData, setFormData] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // getFilmes/getSalas return the data array directly (not wrapped in .data)
        const [filmesData, salasData] = await Promise.all([getFilmes(), getSalas()]);
        setFilmes(filmesData);
        setSalas(salasData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (sessaoEditando) {
      const horario = sessaoEditando.horarioExibicao
        ? String(sessaoEditando.horarioExibicao).slice(0, 16) // "YYYY-MM-DDTHH:mm"
        : '';
      setFormData({
        filmeId: String(sessaoEditando.filmeId ?? ''),
        salaId: String(sessaoEditando.salaId ?? ''),
        cinemaId: String((sessaoEditando as any).cinemaId ?? ''),
        horarioExibicao: horario,
      });
    } else {
      setFormData(empty);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessaoEditando]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.filmeId) errs.filmeId = 'Selecione um filme';
    if (!formData.salaId) errs.salaId = 'Selecione uma sala';
    if (!formData.cinemaId) errs.cinemaId = 'ID do Cinema obrigatório';
    if (!formData.horarioExibicao) errs.horarioExibicao = 'Horário obrigatório';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      filmeId: Number(formData.filmeId),
      salaId: Number(formData.salaId),
      cinemaId: Number(formData.cinemaId),
      // datetime-local gives "YYYY-MM-DDTHH:mm", append seconds for ISO 8601
      horarioExibicao: new Date(formData.horarioExibicao).toISOString(),
    };

    setLoading(true);
    try {
      if (sessaoEditando?.id) {
        await updateSessao(sessaoEditando.id, payload as Partial<Sessao>);
      } else {
        await createSessao(payload as Omit<Sessao, 'id'>);
      }
      setFormData(empty);
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-dark border-secondary">
      <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className={`bi ${sessaoEditando ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
          {sessaoEditando ? 'Editar Sessão' : 'Agendar Sessão'}
        </h5>
        {sessaoEditando && (
          <button type="button" className="btn btn-sm btn-outline-dark" onClick={onCancel}>Cancelar</button>
        )}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label text-light">Filme *</label>
              <select name="filmeId" className={`form-select bg-secondary text-light border-0 ${errors.filmeId ? 'is-invalid' : ''}`} value={formData.filmeId} onChange={handleChange}>
                <option value="">Selecione um filme</option>
                {filmes.map((f) => (
                  <option key={f.id} value={f.id}>{f.titulo}</option>
                ))}
              </select>
              {errors.filmeId && <div className="invalid-feedback">{errors.filmeId}</div>}
              {filmes.length === 0 && <small className="text-warning"><i className="bi bi-exclamation-triangle me-1"></i>Cadastre filmes primeiro</small>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label text-light">Sala *</label>
              <select name="salaId" className={`form-select bg-secondary text-light border-0 ${errors.salaId ? 'is-invalid' : ''}`} value={formData.salaId} onChange={handleChange}>
                <option value="">Selecione uma sala</option>
                {salas.map((s) => (
                  <option key={s.id} value={s.id}>Sala {s.numero} ({s.capacidade} lugares)</option>
                ))}
              </select>
              {errors.salaId && <div className="invalid-feedback">{errors.salaId}</div>}
              {salas.length === 0 && <small className="text-warning"><i className="bi bi-exclamation-triangle me-1"></i>Cadastre salas primeiro</small>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label text-light">ID do Cinema *</label>
              <input type="number" name="cinemaId" min="1" className={`form-control bg-secondary text-light border-0 ${errors.cinemaId ? 'is-invalid' : ''}`} value={formData.cinemaId} onChange={handleChange} placeholder="Ex: 1" />
              {errors.cinemaId && <div className="invalid-feedback">{errors.cinemaId}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Data e Horário *</label>
            <input type="datetime-local" name="horarioExibicao" className={`form-control bg-secondary text-light border-0 ${errors.horarioExibicao ? 'is-invalid' : ''}`} value={formData.horarioExibicao} onChange={handleChange} />
            {errors.horarioExibicao && <div className="invalid-feedback">{errors.horarioExibicao}</div>}
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-warning" disabled={loading || filmes.length === 0 || salas.length === 0}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check-lg me-2"></i>}
              {sessaoEditando ? 'Salvar Alterações' : 'Agendar Sessão'}
            </button>
            {sessaoEditando && (
              <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancelar</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessaoForm;