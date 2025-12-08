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

export interface LancheCombo {
  id?: number;
  nome: string;
  descricao: string;
  valorUnitario: number;
  qtUnidade: number; // Estoque ou quantidade no item
  subtotal: number; // Usado para cálculo no pedido
}

export interface Pedido {
  id?: number;
  qtInteira: number;
  qtMeia: number;
  ingressos: Ingresso[];
  lanches: LancheCombo[]; // No pedido, representa os itens comprados
  valorTotal: number;
}

export interface SessaoComDetalhes extends Sessao {
  filme?: Filme;
  sala?: Sala;
}