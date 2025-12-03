import { Filme } from '@/types';
import { deleteFilme } from '@/services/api';

interface FilmesListProps {
  filmes: Filme[];
  onDelete: () => void;
  onEdit: (filme: Filme) => void;
}

const FilmesList = ({ filmes, onDelete, onEdit }: FilmesListProps) => {
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este filme?')) {
      try {
        await deleteFilme(id);
        onDelete();
      } catch (error) {
        console.error('Erro ao deletar filme:', error);
        alert('Erro ao deletar filme.');
      }
    }
  };

  const getClassificacaoBadge = (classificacao: string) => {
    const colors: Record<string, string> = {
      Livre: 'bg-success',
      '10': 'bg-info',
      '12': 'bg-primary',
      '14': 'bg-warning text-dark',
      '16': 'bg-orange',
      '18': 'bg-danger',
    };
    return colors[classificacao] || 'bg-secondary';
  };

  if (filmes.length === 0) {
    return (
      <div className="alert alert-secondary text-center">
        <i className="bi bi-film me-2"></i>
        Nenhum filme cadastrado. Adicione um filme usando o formulário acima.
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {filmes.map((filme) => (
        <div className="col" key={filme.id}>
          <div className="card h-100 bg-dark border-secondary text-light">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="card-title text-warning mb-0">{filme.titulo}</h5>
                <span className={`badge ${getClassificacaoBadge(filme.classificacao)}`}>
                  {filme.classificacao === 'Livre' ? 'L' : filme.classificacao}
                </span>
              </div>
              <p className="card-text small text-secondary">{filme.sinopse}</p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge bg-secondary">
                  <i className="bi bi-clock me-1"></i>
                  {filme.duracao} min
                </span>
                <span className="badge bg-secondary">
                  <i className="bi bi-tag me-1"></i>
                  {filme.genero}
                </span>
              </div>
              <small className="text-muted d-block mb-3">
                <i className="bi bi-calendar me-1"></i>
                {filme.datasExibicao}
              </small>
            </div>
            <div className="card-footer bg-transparent border-secondary d-flex gap-2">
              <button
                className="btn btn-outline-warning btn-sm w-50"
                onClick={() => onEdit(filme)}
              >
                <i className="bi bi-pencil me-1"></i>
                Editar
              </button>
              <button
                className="btn btn-outline-danger btn-sm w-50"
                onClick={() => filme.id && handleDelete(filme.id)}
              >
                <i className="bi bi-trash me-1"></i>
                Excluir
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilmesList;