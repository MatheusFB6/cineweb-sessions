import axios from 'axios';
import { Filme, Sala, Sessao, LancheCombo, Pedido, Address } from '../types';

// 1. Configuração Base da API
export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// 2. Interceptor de Autenticação (O "Pedágio" do JWT)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@Cineweb:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta (Para pegar os erros do ValidationPipe)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 400 && error.response?.data?.message) {
      const msgs = Array.isArray(error.response.data.message)
        ? error.response.data.message.join('\n')
        : error.response.data.message;
      alert(`Validação recusada pelo Backend:\n${msgs}`);
    }
    return Promise.reject(error);
  }
);

// ==========================================
// FUNÇÕES DE FILMES
// ==========================================
export const getFilmes = async () => {
  const response = await api.get<Filme[]>('/filmes');
  return response.data;
};

export const createFilme = async (filme: Omit<Filme, 'id'>) => {
  const response = await api.post<Filme>('/filmes', filme);
  return response.data;
};

export const updateFilme = async (id: number, filme: Partial<Filme>) => {
  const payload = { ...filme };
  delete payload.id;
  const response = await api.put<Filme>(`/filmes/${id}`, payload);
  return response.data;
};

export const deleteFilme = async (id: number) => {
  await api.delete(`/filmes/${id}`);
};

// ==========================================
// FUNÇÕES DE SALAS
// ==========================================
export const getSalas = async () => {
  const response = await api.get<Sala[]>('/salas');
  return response.data;
};

export const createSala = async (sala: Omit<Sala, 'id'>) => {
  const response = await api.post<Sala>('/salas', sala);
  return response.data;
};

export const updateSala = async (id: number, sala: Partial<Sala>) => {
  const payload = { ...sala };
  delete payload.id;
  const response = await api.put<Sala>(`/salas/${id}`, payload);
  return response.data;
};

export const deleteSala = async (id: number) => {
  await api.delete(`/salas/${id}`);
};

// ==========================================
// FUNÇÕES DE SESSÕES
// ==========================================
export const getSessoes = async () => {
  const response = await api.get<Sessao[]>('/sessoes');
  return response.data;
};

export const createSessao = async (sessao: Omit<Sessao, 'id'>) => {
  const response = await api.post<Sessao>('/sessoes', sessao);
  return response.data;
};

export const updateSessao = async (id: number, sessao: Partial<Sessao>) => {
  const payload = { ...sessao };
  delete payload.id;
  const response = await api.put<Sessao>(`/sessoes/${id}`, payload);
  return response.data;
};

export const deleteSessao = async (id: number) => {
  await api.delete(`/sessoes/${id}`);
};

// ==========================================
// FUNÇÕES DE LANCHES
// ==========================================
export const getLancheCombos = async () => {
  const response = await api.get<LancheCombo[]>('/lanches');
  return response.data;
};

export const createLanche = async (lanche: Omit<LancheCombo, 'id'>) => {
  const response = await api.post<LancheCombo>('/lanches', lanche);
  return response.data;
};

export const updateLanche = async (id: number, lanche: Partial<LancheCombo>) => {
  const payload = { ...lanche };
  delete payload.id;
  const response = await api.put<LancheCombo>(`/lanches/${id}`, payload);
  return response.data;
};

export const deleteLanche = async (id: number) => {
  await api.delete(`/lanches/${id}`);
};

// ==========================================
// FUNÇÕES DE PEDIDOS
// ==========================================
export const createPedido = async (pedido: Pedido) => {
  const response = await api.post('/pedidos', pedido);
  return response.data;
};

// ==========================================
// FUNÇÕES DE USUÁRIO / AUTENTICAÇÃO
// ==========================================
export interface RegisterData {
  name?: string;
  email: string;
  password?: string;
  profileId?: string;
}

export const registerUser = async (userData: RegisterData) => {
  const response = await api.post('/user', userData);
  return response.data;
};

export const createAddress = async (addressData: Partial<Address>) => {
  const response = await api.post('/address', addressData);
  return response.data;
};