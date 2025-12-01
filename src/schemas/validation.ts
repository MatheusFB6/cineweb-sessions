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

export const ingressoSchema = z.object({
  sessaoId: z.number().positive(),
  tipo: z.enum(['inteira', 'meia']),
});

export type FilmeFormData = z.infer<typeof filmeSchema>;
export type SalaFormData = z.infer<typeof salaSchema>;
export type SessaoFormData = z.infer<typeof sessaoSchema>;
export type IngressoFormData = z.infer<typeof ingressoSchema>;
