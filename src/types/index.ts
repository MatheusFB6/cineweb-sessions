export interface Filme {
  id?: number;
  titulo: string;
  sinopse: string;
  classificacao: string;
  duracao: number;
  genero: string;
  datasExibicao: string;
}

export interface Sala {
  id?: number;
  numero: number;
  capacidade: number;
}

export interface Sessao {
  id?: number;
  filmeId: number;
  salaId: number;
  dataHora: string;
}

export interface Ingresso {
  id?: number;
  sessaoId: number;
  tipo: 'inteira' | 'meia';
  valor: number;
}

export interface SessaoComDetalhes extends Sessao {
  filme?: Filme;
  sala?: Sala;
}
