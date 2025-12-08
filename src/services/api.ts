import axios from 'axios';
import { Filme, Sala, Sessao, Ingresso, LancheCombo, Pedido } from '@/types';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Filmes
export const getFilmes = () => api.get<Filme[]>('/filmes');
export const createFilme = (filme: Omit<Filme, 'id'>) => api.post<Filme>('/filmes', filme);
export const updateFilme = (filme: Filme) => api.put<Filme>(`/filmes/${filme.id}`, filme);
export const deleteFilme = (id: number) => api.delete(`/filmes/${id}`);
export const getFilme = (id: number) => api.get<Filme>(`/filmes/${id}`);

// Salas
export const getSalas = () => api.get<Sala[]>('/salas');
export const createSala = (sala: Omit<Sala, 'id'>) => api.post<Sala>('/salas', sala);
export const updateSala = (sala: Sala) => api.put<Sala>(`/salas/${sala.id}`, sala);
export const deleteSala = (id: number) => api.delete(`/salas/${id}`);

// Sessoes
export const getSessoes = () => api.get<Sessao[]>('/sessoes');
export const createSessao = (sessao: Omit<Sessao, 'id'>) => api.post<Sessao>('/sessoes', sessao);
export const updateSessao = (sessao: Sessao) => api.put<Sessao>(`/sessoes/${sessao.id}`, sessao);
export const deleteSessao = (id: number) => api.delete(`/sessoes/${id}`);

// Ingressos (Mantido para compatibilidade, mas o foco é Pedido)
export const getIngressos = () => api.get<Ingresso[]>('/ingressos');
export const createIngresso = (ingresso: Omit<Ingresso, 'id'>) => api.post<Ingresso>('/ingressos', ingresso);
export const getIngressosBySessao = (sessaoId: number) => 
  api.get<Ingresso[]>(`/ingressos?sessaoId=${sessaoId}`);

// Lanches
export const getLanches = () => api.get<LancheCombo[]>('/lanches');
export const createLanche = (lanche: Omit<LancheCombo, 'id'>) => api.post<LancheCombo>('/lanches', lanche);
export const updateLanche = (lanche: LancheCombo) => api.put<LancheCombo>(`/lanches/${lanche.id}`, lanche);
export const deleteLanche = (id: number) => api.delete(`/lanches/${id}`);

// Pedidos
export const createPedido = (pedido: Omit<Pedido, 'id'>) => api.post<Pedido>('/pedidos', pedido);

export default api;