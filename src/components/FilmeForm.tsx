import { useState, useEffect } from 'react';
import { createFilme, updateFilme } from '@/services/api';
import { Filme } from '@/types';

interface FilmeFormProps {
  onSuccess: () => void;
  filmeEditando: Filme | null;
  onCancel: () => void;
}

const GENERO_OPTIONS = [
  { label: 'Ação', value: 'ACAO' },
  { label: 'Aventura', value: 'AVENTURA' },
  { label: 'Comédia', value: 'COMEDIA' },
  { label: 'Drama', value: 'DRAMA' },
  { label: 'Terror', value: 'TERROR' },
  { label: 'Ficção Científica', value: 'FICCAO' },
  { label: 'Romance', value: 'ROMANCE' },
  { label: 'Animação', value: 'ANIMACAO' },
  { label: 'Documentário', value: 'DOCUMENTARIO' },
  { label: 'Outro', value: 'OUTRO' },
];

const FilmeForm = ({ onSuccess, filmeEditando, onCancel }: FilmeFormProps) => {
  const empty = {
    titulo: '',
    sinopse: '',
    classificacao: '',
    duracaoMinutos: '',
    genero: '',
    cinemaId: '',
    dataInicioExibicao: '',
    dataFinalExibicao: '',
    elenco: '',
  };

  const [formData, setFormData] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (filmeEditando) {
      setFormData({
        titulo: filmeEditando.titulo ?? '',
        sinopse: filmeEditando.sinopse ?? '',
        classificacao: filmeEditando.classificacao ?? '',
        duracaoMinutos: '',
        genero: filmeEditando.genero ?? '',
        cinemaId: String((filmeEditando as any).cinemaId ?? ''),
        dataInicioExibicao: filmeEditando.dataInicioExibicao
          ? String(filmeEditando.dataInicioExibicao).slice(0, 10)
          : '',
        dataFinalExibicao: filmeEditando.dataFinalExibicao
          ? String(filmeEditando.dataFinalExibicao).slice(0, 10)
          : '',
        elenco: filmeEditando.elenco ?? '',
      });
    } else {
      setFormData(empty);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filmeEditando]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.titulo.trim()) errs.titulo = 'Título obrigatório';
    if (!formData.duracaoMinutos || Number(formData.duracaoMinutos) <= 0)
      errs.duracaoMinutos = 'Duração em minutos obrigatória';
    if (!formData.cinemaId) errs.cinemaId = 'Cinema obrigatório';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    // Convert minutes to ISO DateTime (using 1970-01-01 base date for "duration as datetime")
    const mins = Number(formData.duracaoMinutos);
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    const duracao = `1970-01-01T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00.000Z`;

    const payload: Record<string, unknown> = {
      titulo: formData.titulo,
      sinopse: formData.sinopse || undefined,
      classificacao: formData.classificacao || undefined,
      duracao,
      genero: formData.genero || undefined,
      cinemaId: Number(formData.cinemaId),
      elenco: formData.elenco || undefined,
      dataInicioExibicao: formData.dataInicioExibicao
        ? new Date(formData.dataInicioExibicao).toISOString()
        : undefined,
      dataFinalExibicao: formData.dataFinalExibicao
        ? new Date(formData.dataFinalExibicao).toISOString()
        : undefined,
    };
    // Remove undefined fields
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    setLoading(true);
    try {
      if (filmeEditando?.id) {
        await updateFilme(filmeEditando.id, payload as Partial<Filme>);
      } else {
        await createFilme(payload as Omit<Filme, 'id'>);
      }
      setFormData(empty);
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar filme:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-dark border-secondary">
      <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className={`bi ${filmeEditando ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
          {filmeEditando ? 'Editar Filme' : 'Cadastrar Filme'}
        </h5>
        {filmeEditando && (
          <button type="button" className="btn btn-sm btn-outline-dark" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Título *</label>
              <input type="text" name="titulo" className={`form-control bg-secondary text-light border-0 ${errors.titulo ? 'is-invalid' : ''}`} value={formData.titulo} onChange={handleChange} placeholder="Ex: Vingadores" />
              {errors.titulo && <div className="invalid-feedback">{errors.titulo}</div>}
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label text-light">Duração (min) *</label>
              <input type="number" name="duracaoMinutos" min="1" className={`form-control bg-secondary text-light border-0 ${errors.duracaoMinutos ? 'is-invalid' : ''}`} value={formData.duracaoMinutos} onChange={handleChange} placeholder="Ex: 120" />
              {errors.duracaoMinutos && <div className="invalid-feedback">{errors.duracaoMinutos}</div>}
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label text-light">Classificação</label>
              <select name="classificacao" className="form-select bg-secondary text-light border-0" value={formData.classificacao} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="Livre">Livre</option>
                <option value="10">10 anos</option>
                <option value="12">12 anos</option>
                <option value="14">14 anos</option>
                <option value="16">16 anos</option>
                <option value="18">18 anos</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Gênero</label>
              <select name="genero" className="form-select bg-secondary text-light border-0" value={formData.genero} onChange={handleChange}>
                <option value="">Selecione</option>
                {GENERO_OPTIONS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">ID do Cinema *</label>
              <input type="number" name="cinemaId" className={`form-control bg-secondary text-light border-0 ${errors.cinemaId ? 'is-invalid' : ''}`} value={formData.cinemaId} onChange={handleChange} placeholder="Ex: 1" />
              {errors.cinemaId && <div className="invalid-feedback">{errors.cinemaId}</div>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Início Exibição</label>
              <input type="date" name="dataInicioExibicao" className="form-control bg-secondary text-light border-0" value={formData.dataInicioExibicao} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Fim Exibição</label>
              <input type="date" name="dataFinalExibicao" className="form-control bg-secondary text-light border-0" value={formData.dataFinalExibicao} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Elenco</label>
            <input type="text" name="elenco" className="form-control bg-secondary text-light border-0" value={formData.elenco} onChange={handleChange} placeholder="Ex: Robert Downey Jr., Scarlett Johansson" />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Sinopse</label>
            <textarea name="sinopse" className="form-control bg-secondary text-light border-0" rows={3} value={formData.sinopse} onChange={handleChange} placeholder="Descrição do filme..." />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-warning" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check-lg me-2"></i>}
              {filmeEditando ? 'Salvar Alterações' : 'Cadastrar Filme'}
            </button>
            {filmeEditando && (
              <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancelar</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilmeForm;