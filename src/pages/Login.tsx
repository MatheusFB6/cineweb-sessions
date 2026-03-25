import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Faz a requisição de login para pegar o Token
      const authResponse = await api.post('/auth/login', { email, password });
      const token = authResponse.data.access_token;

      // 2. Decodifica o payload do JWT para pegar o ID do usuário (sub)
      // O atob decodifica a base64 do token
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.sub;

      // 3. Busca as informações completas do usuário (Nome, Perfil, etc)
      // Passamos o header manualmente aqui pois o interceptor ainda não "sabe" do token
      const userResponse = await api.get(`/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 4. Salva no contexto e no localStorage
      signIn(token, userResponse.data);

      // 5. Redireciona para a página de Filmes (Página inicial)
      navigate('/filmes');
    } catch (err: unknown) {
          const errorMessage = axios.isAxiosError(err) 
            ? err.response?.data?.message 
            : 'Erro ao fazer login. Verifique se o email e senha estão corretos.';
          setError(
            errorMessage || 'Erro ao fazer login. Verifique se o email e senha estão corretos.');
        } finally {
          setIsLoading(false);
        }
      };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Acesso ao Sistema
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="exemplo@cinema.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}