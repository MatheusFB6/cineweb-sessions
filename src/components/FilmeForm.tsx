import { useState } from 'react';
import { filmeSchema } from '@/schemas/validation';
import { createFilme } from '@/services/api';
import { Filme } from '@/types';

interface FilmeFormProps {
  onSuccess: () => void;
}

const FilmeForm = ({ onSuccess }: FilmeFormProps) => {
  const [formData, setFormData] = useState({
    titulo: '',
    sinopse: '',
    classificacao: '',
    duracao: '',
    genero: '',
    datasExibicao: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const dataToValidate = {
      ...formData,
      duracao: Number(formData.duracao),
    };

    const result = filmeSchema.safeParse(dataToValidate);

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
      await createFilme(result.data as Omit<Filme, 'id'>);
      setFormData({
        titulo: '',
        sinopse: '',
        classificacao: '',
        duracao: '',
        genero: '',
        datasExibicao: '',
      });
      onSuccess();
    } catch (error) {
      console.error('Erro ao cadastrar filme:', error);
      alert('Erro ao cadastrar filme. Verifique se o json-server está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-dark border-secondary">
      <div className="card-header bg-warning text-dark">
        <h5 className="mb-0">
          <i className="bi bi-plus-circle me-2"></i>
          Cadastrar Filme
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Título *</label>
              <input
                type="text"
                name="titulo"
                className={`form-control bg-secondary text-light border-0 ${errors.titulo ? 'is-invalid' : ''}`}
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Digite o título do filme"
              />
              {errors.titulo && <div className="invalid-feedback">{errors.titulo}</div>}
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label text-light">Duração (min) *</label>
              <input
                type="number"
                name="duracao"
                className={`form-control bg-secondary text-light border-0 ${errors.duracao ? 'is-invalid' : ''}`}
                value={formData.duracao}
                onChange={handleChange}
                placeholder="Ex: 120"
              />
              {errors.duracao && <div className="invalid-feedback">{errors.duracao}</div>}
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label text-light">Classificação *</label>
              <select
                name="classificacao"
                className={`form-select bg-secondary text-light border-0 ${errors.classificacao ? 'is-invalid' : ''}`}
                value={formData.classificacao}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="Livre">Livre</option>
                <option value="10">10 anos</option>
                <option value="12">12 anos</option>
                <option value="14">14 anos</option>
                <option value="16">16 anos</option>
                <option value="18">18 anos</option>
              </select>
              {errors.classificacao && <div className="invalid-feedback">{errors.classificacao}</div>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Gênero *</label>
              <select
                name="genero"
                className={`form-select bg-secondary text-light border-0 ${errors.genero ? 'is-invalid' : ''}`}
                value={formData.genero}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="Ação">Ação</option>
                <option value="Aventura">Aventura</option>
                <option value="Comédia">Comédia</option>
                <option value="Drama">Drama</option>
                <option value="Ficção Científica">Ficção Científica</option>
                <option value="Terror">Terror</option>
                <option value="Romance">Romance</option>
                <option value="Animação">Animação</option>
                <option value="Documentário">Documentário</option>
              </select>
              {errors.genero && <div className="invalid-feedback">{errors.genero}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Datas de Exibição *</label>
              <input
                type="text"
                name="datasExibicao"
                className={`form-control bg-secondary text-light border-0 ${errors.datasExibicao ? 'is-invalid' : ''}`}
                value={formData.datasExibicao}
                onChange={handleChange}
                placeholder="Ex: 01/01/2024 a 31/01/2024"
              />
              {errors.datasExibicao && <div className="invalid-feedback">{errors.datasExibicao}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Sinopse * (mín. 10 caracteres)</label>
            <textarea
              name="sinopse"
              className={`form-control bg-secondary text-light border-0 ${errors.sinopse ? 'is-invalid' : ''}`}
              rows={3}
              value={formData.sinopse}
              onChange={handleChange}
              placeholder="Digite a sinopse do filme"
            />
            {errors.sinopse && <div className="invalid-feedback">{errors.sinopse}</div>}
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
                Cadastrar Filme
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FilmeForm;
