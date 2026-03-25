export enum GeneroEnum {
  ACAO = 'Ação',
  COMEDIA = 'Comédia',
  DRAMA = 'Drama',
  FICCAO = 'Ficção Científica',
  TERROR = 'Terror',
  ROMANCE = 'Romance',
  OUTRO = 'Outro'
}

export class Sala {
  id?: number;
  numero!: number;
  capacidade!: number;
  poltronas: number[][] = [];

  reservarPoltrona(fila: number, num: number): void {}
  calcularCapacidade(): number { return this.capacidade; }
}

export class Filme {
  id?: number;
  titulo!: string;
  sinopse!: string;
  classificacao!: string;
  duracao!: Date | number;
  elenco!: string;
  genero!: GeneroEnum | string;
  dataInicioExibicao!: Date;
  dataFinalExibicao!: Date;
  
  // Legacy fields for backwards compatibility with existing UI
  datasExibicao?: string;
}

export class Sessao {
  id?: number;
  horarioExibicao!: Date;
  filme?: Filme;
  sala?: Sala;

  // Legacy fields
  filmeId?: number;
  salaId?: number;
  dataHora?: string;
}

export class Ingresso {
  id?: number;
  valorInteira!: number;
  valorMeia!: number;
  sessao?: Sessao;

  // Legacy fields
  sessaoId?: number;
  tipo?: 'Inteira' | 'Meia';
  valor?: number;
}

export class LancheCombo {
  id?: number;
  nome!: string;
  descricao!: string;
  valorUnitario!: number;
  quantidade!: number;
  subtotal!: number;

  // Legacy fields
  qtUnidade?: number;
}

export class Pedido {
  id?: number;
  qtInteira!: number;
  qtMeia!: number;
  ingresso: Ingresso[] = [];
  lanche: LancheCombo[] = [];
  valorTotal!: number;

  adicionaLanche(lanche: LancheCombo): void {
      this.lanche.push(lanche);
  }
  removerLanche(id: number): void {
      this.lanche = this.lanche.filter(l => l.id !== id);
  }
  adicionarIngresso(ingresso: Ingresso): void {
      this.ingresso.push(ingresso);
  }
  removerIngresso2(id: number): void {
      this.ingresso = this.ingresso.filter(i => i.id !== id);
  }
  
  // Legacy fields
  ingressos?: Ingresso[];
  lanches?: { id: number; qtUnidade: number; subtotal: number }[];
}

export class Cinema {
  id?: number;
  nome!: string;
  endereco!: string;
  listaSalas: Sala[] = [];
  listaFilmes: Filme[] = [];
  listaSessao: Sessao[] = [];

  cadastrarSala(sala: Sala): void {
      this.listaSalas.push(sala);
  }
  removerSala(id: number): void {
      this.listaSalas = this.listaSalas.filter(s => s.id !== id);
  }
  cadastrarFilme(filme: Filme): void {
      this.listaFilmes.push(filme);
  }
  removerFilme(id: number): void {
      this.listaFilmes = this.listaFilmes.filter(f => f.id !== id);
  }
  cadastrarSessao(sessao: Sessao): void {
      this.listaSessao.push(sessao);
  }
  removerSessao(id: number): void {
      this.listaSessao = this.listaSessao.filter(s => s.id !== id);
  }
}

export class Profile {
  id!: string;
  name!: string;
  createdAt!: Date | string;
  updatedAt!: Date | string;
  users: User[] = [];
}

export class User {
  id!: string;
  email!: string;
  password!: string;
  name!: string;
  profile!: Profile;
  profileId!: string;
}

export class Address {
  id!: string;
  street!: string;
  number!: number;
  city!: string;
  state!: string;
  zipCode!: string;
  user!: User;
  userId!: string;
  createdAt!: Date | string;
  updatedAt!: Date | string;
}

// Backwards compat type
export type SessaoComDetalhes = Sessao;