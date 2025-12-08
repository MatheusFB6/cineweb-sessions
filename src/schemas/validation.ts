import { z } from 'zod';

export const filmeSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  sinopse: z.string().min(10, 'Sinopse deve ter no mínimo 10 caracteres'),
  classificacao: z.string().min(1, 'Classificação é obrigatória'),
  duracao: z.number().positive('Duração deve ser maior que 0'),
  genero: z.string().min(1, 'Gênero é obrigatório'),
  datasExibicao: z.string().min(1, 'Datas de exibição são obrigatórias'),
});

export const salaSchema = z.object({
  numero: z.number().positive('Número da sala deve ser maior que 0'),
  capacidade: z.number().positive('Capacidade deve ser maior que 0'),
});

export const sessaoSchema = z.object({
  filmeId: z.number().positive('Selecione um filme'),
  salaId: z.number().positive('Selecione uma sala'),
  dataHora: z.string().refine((val) => {
    const selectedDate = new Date(val);
    const now = new Date();
    return selectedDate > now;
  }, 'A data não pode ser retroativa'),
});

export const lancheSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  descricao: z.string().min(5, 'Descrição deve ter no mínimo 5 caracteres'),
  valorUnitario: z.number().positive('Valor deve ser positivo'),
  qtUnidade: z.number().int().nonnegative('Quantidade deve ser 0 ou maior'),
});

// Tipos inferidos
export type FilmeFormData = z.infer<typeof filmeSchema>;
export type SalaFormData = z.infer<typeof salaSchema>;
export type SessaoFormData = z.infer<typeof sessaoSchema>;
export type LancheFormData = z.infer<typeof lancheSchema>;