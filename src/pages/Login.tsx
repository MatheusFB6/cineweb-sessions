import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const authResponse = await api.post('/auth/login', { email, password });
      const token = authResponse.data.access_token;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.sub;

      const userResponse = await api.get(`/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      signIn(token, userResponse.data);

      // Redireciona conforme o UUID do Profile
      if (userResponse.data.profileId === 'profile-admin-001') {
        navigate('/admin/dashboard');
      } else {
        navigate('/filmes');
      }
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message
        : 'Erro ao fazer login. Verifique se o e-mail e senha estão corretos.';
      setError(typeof errorMessage === 'string' ? errorMessage : 'Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark py-5">
      <div
        className="card shadow-lg p-4 w-100 bg-black border border-warning"
        style={{ maxWidth: '440px', borderRadius: '1rem' }}
      >
        <div className="card-body">
          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-10 border border-warning mb-3"
              style={{ width: '72px', height: '72px' }}
            >
              <i className="bi bi-camera-reels-fill text-warning fs-2"></i>
            </div>
            <h2 className="text-warning fw-bold mb-1" style={{ letterSpacing: '-0.5px' }}>
              CINEWEB
            </h2>
            <p className="text-secondary small mb-0">Insira suas credenciais para acessar</p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="alert border-danger text-danger bg-dark d-flex align-items-center gap-2 mb-3"
              role="alert"
              style={{ borderRadius: '0.5rem' }}
            >
              <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
              <span className="small">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            <div className="form-floating">
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control bg-dark text-light border-secondary"
                placeholder="exemplo@cinema.com"
                autoComplete="email"
              />
              <label htmlFor="login-email" className="text-secondary">
                E-mail
              </label>
            </div>

            {/* Password with toggle */}
            <div className="input-group">
              <div className="form-floating flex-grow-1">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control bg-dark text-light border-secondary"
                  style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                  placeholder="********"
                  autoComplete="current-password"
                />
                <label htmlFor="login-password" className="text-secondary">
                  Senha
                </label>
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary border-secondary bg-dark text-secondary px-3"
                onClick={() => setShowPassword((v) => !v)}
                title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-warning py-3 fw-bold text-dark border-0 shadow"
              style={{ borderRadius: '0.5rem' }}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2 text-dark"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Verificando...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>Acessar Plataforma
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4 pt-3 border-top border-secondary">
            <span className="text-secondary small">Não tem uma conta? </span>
            <Link
              to="/register"
              className="text-warning fw-bold text-decoration-none"
            >
              Cadastre-se agora
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}