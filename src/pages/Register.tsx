import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { api, registerUser, createAddress } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [step, setStep] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSecret, setAdminSecret] = useState('');
  
  // Account
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Address
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleNextBase = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isAdmin && adminSecret !== '123456') {
      setError('Senha mestre de administrador incorreta.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Cria o usuário no banco de dados
      const profileId = isAdmin ? 'profile-admin-001' : 'profile-user-001';
      const newUser = await registerUser({
        name,
        email,
        password,
        profileId, 
      });

      // 2. Cria endereço associado ao ID retornado
      await createAddress({
        street,
        number: Number(number),
        city,
        state,
        zipCode,
        userId: newUser.id
      });

      // 3. Efetua o login automático para não obrigar o user a digitar a senha novamente
      const authResponse = await api.post('/auth/login', { email, password });
      const token = authResponse.data.access_token;

      if (!token) {
        throw new Error('Token não retornado pela API de login.');
      }

      // 4. Busca os dados para context
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userResponse = await api.get(`/user/${payload.sub}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 5. Salva a sessão e redireciona (Se for admin para o painel de admin)
      signIn(token, userResponse.data);
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/filmes');
      }

    } catch (err: unknown) {
      console.error(err);
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.response?.data?.error
        : 'Erro ao criar conta. Verifique os dados e tente novamente.';
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage.toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark py-5">
      <div className="card shadow-lg p-4 w-100 bg-black border border-warning" style={{ maxWidth: '500px', borderRadius: '1rem' }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <i className="bi bi-person-plus-fill text-warning display-4"></i>
            <h2 className="text-warning fw-bold mt-2" style={{ letterSpacing: '-0.5px' }}>
              Criar Nova Conta
            </h2>
            <div className="d-flex justify-content-center mt-3 mb-2">
              <span className={`badge ${step === 1 ? 'bg-warning text-dark' : 'bg-dark border border-secondary text-secondary'} me-2 py-2 px-3 rounded-pill transition-all`}>1. Dados da Conta</span>
              <span className={`badge ${step === 2 ? 'bg-warning text-dark' : 'bg-dark border border-secondary text-secondary'} py-2 px-3 rounded-pill transition-all`}>2. Endereço</span>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger border-danger text-danger bg-dark" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleNextBase} className="d-flex flex-column gap-3">
              <div className="form-check form-switch mb-2 p-3 border border-secondary rounded bg-dark d-flex align-items-center">
                <input 
                  className="form-check-input bg-warning border-warning ms-0 mt-0 me-3 fs-5" 
                  type="checkbox" 
                  role="switch"
                  id="adminSwitch" 
                  checked={isAdmin} 
                  onChange={(e) => setIsAdmin(e.target.checked)} 
                />
                <label className="form-check-label text-light fw-bold" htmlFor="adminSwitch">
                  Conta Administrador
                  <small className="d-block text-secondary fw-normal">Possui acesso total ao sistema</small>
                </label>
              </div>

              {isAdmin && (
                <div className="p-3 border border-danger rounded mb-2" style={{ backgroundColor: '#210b0b' }}>
                  <label className="form-label fw-bold text-danger mb-2"><i className="bi bi-shield-lock me-1"></i>Senha Mestre (Obrigatória para Admin)</label>
                  <input
                    type="password"
                    required={isAdmin}
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                    className="form-control bg-dark text-light border-danger focus-ring focus-ring-danger"
                    placeholder="Digite a credencial de segurança"
                  />
                </div>
              )}

              <div className="form-floating">
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control bg-dark text-light border-secondary focus-ring focus-ring-warning"
                  placeholder="Nome Completo"
                />
                <label htmlFor="name" className="text-secondary">Nome Completo</label>
              </div>

              <div className="form-floating">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control bg-dark text-light border-secondary focus-ring focus-ring-warning"
                  placeholder="name@example.com"
                />
                <label htmlFor="email" className="text-secondary">E-mail</label>
              </div>

              <div className="row g-2">
                <div className="col-6">
                  <div className="form-floating">
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control bg-dark text-light border-secondary focus-ring focus-ring-warning"
                      placeholder="Senha"
                    />
                    <label htmlFor="password" className="text-secondary">Senha</label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-floating">
                    <input
                      id="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-control bg-dark text-light border-secondary focus-ring focus-ring-warning"
                      placeholder="Confirmar"
                    />
                    <label htmlFor="confirmPassword" className="text-secondary">Confirmar</label>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-warning py-3 fw-bold mt-2 text-dark border-0 shadow" style={{ borderRadius: '0.5rem' }}>
                Avançar <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleRegister} className="d-flex flex-column gap-3">
              <div className="row g-2">
                <div className="col-8">
                  <div className="form-floating">
                    <input id="street" type="text" required value={street} onChange={(e) => setStreet(e.target.value)} className="form-control bg-dark text-light border-secondary focus-ring focus-ring-warning" placeholder="Rua" />
                    <label htmlFor="street" className="text-secondary">Logradouro / Rua</label>
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-floating">
                    <input id="number" type="number" required value={number} onChange={(e) => setNumber(e.target.value)} className="form-control bg-dark text-light border-secondary focus-ring focus-ring-warning" placeholder="Num" />
                    <label htmlFor="number" className="text-secondary">Número</label>
                  </div>
                </div>
              </div>

              <div className="row g-2">
                <div className="col-5">
                  <div className="form-floating">
                    <input id="city" type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="form-control bg-dark text-light border-secondary focus-ring focus-ring-warning" placeholder="Cidade" />
                    <label htmlFor="city" className="text-secondary">Cidade</label>
                  </div>
                </div>
                <div className="col-3">
                  <div className="form-floating">
                    <input id="state" type="text" maxLength={2} required value={state} onChange={(e) => setState(e.target.value)} className="form-control bg-dark text-light border-secondary focus-ring focus-ring-warning" placeholder="UF" />
                    <label htmlFor="state" className="text-secondary">UF</label>
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-floating">
                    <input id="zipCode" type="text" required value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="form-control bg-dark text-light border-secondary focus-ring focus-ring-warning" placeholder="CEP" />
                    <label htmlFor="zipCode" className="text-secondary">CEP</label>
                  </div>
                </div>
              </div>
              
              <div className="d-flex gap-2 mt-4">
                <button type="button" onClick={() => setStep(1)} className="btn btn-outline-secondary py-3 w-50" style={{ borderRadius: '0.5rem' }}>
                  <i className="bi bi-arrow-left me-1"></i> Voltar
                </button>
                <button type="submit" disabled={isLoading} className={`btn btn-warning py-3 w-50 fw-bold text-dark border-0 shadow ${isLoading ? 'disabled opacity-75' : ''}`} style={{ borderRadius: '0.5rem' }}>
                  {isLoading ? 'Cadastrando...' : 'Finalizar'}
                </button>
              </div>
            </form>
          )}

          <div className="text-center mt-4">
            <span className="text-light small">Já possui uma conta? </span>
            <Link to="/login" className="text-warning fw-bold text-decoration-none border-bottom border-warning">
              Faça Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}