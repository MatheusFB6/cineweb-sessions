import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.sub;

      // 3. Busca as informações completas do usuário
      const userResponse = await api.get(`/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 4. Salva no contexto e no localStorage
      signIn(token, userResponse.data);

      // 5. Redireciona com base no perfil
      if (userResponse.data.profileId === 1) {
        navigate('/admin/dashboard');
      } else {
        navigate('/filmes');
      }
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message 
        : 'Erro ao fazer login. Verifique se o e-mail e senha estão corretos.';
      setError(errorMessage || 'Erro ao fazer login. Verifique se o e-mail e senha estão corretos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark py-5">
      <div className="card shadow-lg p-4 w-100 bg-black border border-warning" style={{ maxWidth: '420px', borderRadius: '1rem' }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <i className="bi bi-person-circle text-warning display-4"></i>
            <h2 className="text-warning fw-bold mt-2" style={{ letterSpacing: '-0.5px' }}>
              Acesso Segurado
            </h2>
            <p className="text-secondary small mt-1">Insira suas credenciais para entrar</p>
          </div>

          {error && (
            <div className="alert alert-danger border-danger text-danger bg-dark" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="d-flex flex-column gap-3 mt-4">
            <div className="form-floating">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control bg-dark text-light border-secondary focus-ring focus-ring-warning"
                placeholder="exemplo@cinema.com"
              />
              <label htmlFor="email" className="text-secondary">E-mail</label>
            </div>

            <div className="form-floating">
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control bg-dark text-light border-secondary focus-ring focus-ring-warning"
                placeholder="********"
              />
              <label htmlFor="password" className="text-secondary">Senha</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-warning py-3 fw-bold mt-3 text-dark border-0 shadow ${isLoading ? 'disabled opacity-75' : ''}`}
              style={{ borderRadius: '0.5rem' }}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2 text-dark" role="status" aria-hidden="true"></span>
                  Entrando...
                </>
              ) : 'Acessar Plataforma'}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-light small">Não tem uma conta? </span>
            <Link to="/register" className="text-warning fw-bold text-decoration-none border-bottom border-warning pb-1">
              Cadastre-se agora
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}