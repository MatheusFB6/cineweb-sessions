import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import GenericCrud from './GenericCrud';
import PedidosAdminView from './PedidosAdminView';

type AdminTab =
  | 'home'
  | 'users'
  | 'profiles'
  | 'addresses'
  | 'cinemas'
  | 'filmes'
  | 'salas'
  | 'sessoes'
  | 'lanches'
  | 'ingressos'
  | 'pedidos';

interface NavItem {
  tab: AdminTab;
  label: string;
  icon: string;
}

const NAV_GROUPS: { title: string; icon: string; items: NavItem[] }[] = [
  {
    title: 'Usuários',
    icon: 'bi-people',
    items: [
      { tab: 'users', label: 'Usuários', icon: 'bi-person' },
      { tab: 'profiles', label: 'Perfis (Profiles)', icon: 'bi-file-earmark-person' },
      { tab: 'addresses', label: 'Endereços', icon: 'bi-geo-alt' },
    ],
  },
  {
    title: 'Cinema',
    icon: 'bi-building',
    items: [
      { tab: 'cinemas', label: 'Cinemas', icon: 'bi-building' },
      { tab: 'filmes', label: 'Filmes', icon: 'bi-camera-reels' },
      { tab: 'salas', label: 'Salas', icon: 'bi-door-open' },
      { tab: 'sessoes', label: 'Sessões', icon: 'bi-calendar-event' },
    ],
  },
  {
    title: 'Vendas',
    icon: 'bi-cart',
    items: [
      { tab: 'lanches', label: 'Lanches / Combos', icon: 'bi-cup-straw' },
      { tab: 'ingressos', label: 'Ingressos', icon: 'bi-ticket-perforated' },
      { tab: 'pedidos', label: 'Pedidos', icon: 'bi-cart' },
    ],
  },
];

const GENERO_OPTIONS = [
  { label: 'Ação', value: 'ACAO' },
  { label: 'Aventura', value: 'AVENTURA' },
  { label: 'Comédia', value: 'COMEDIA' },
  { label: 'Drama', value: 'DRAMA' },
  { label: 'Terror', value: 'TERROR' },
  { label: 'Ficção Científica', value: 'FICCAO' },
  { label: 'Romance', value: 'ROMANCE' },
  { label: 'Animação', value: 'ANIMACAO' },
  { label: 'Documentário', value: 'DOCUMENTARIO' },
  { label: 'Outro', value: 'OUTRO' },
];

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('home');

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      // ---- USUÁRIOS ----
      case 'users':
        return (
          <GenericCrud
            title="Usuários"
            endpoint="/user"
            updateMethod="patch"
            columns={[
              { key: 'name', label: 'Nome' },
              { key: 'email', label: 'E-mail' },
              { key: 'profileId', label: 'Profile', render: (v) => v === 'profile-admin-001' ? '🔴 Admin' : '🟢 User' },
            ]}
            fields={[
              { name: 'name', label: 'Nome Completo', type: 'text', required: true },
              { name: 'email', label: 'E-mail', type: 'email', required: true },
              { name: 'password', label: 'Senha (deixe em branco para manter)', type: 'password', required: false },
              {
                name: 'profileId',
                label: 'Perfil',
                type: 'select',
                required: true,
                options: [
                  { label: 'Usuário Comum', value: 'profile-user-001' },
                  { label: 'Administrador', value: 'profile-admin-001' },
                ],
              },
            ]}
          />
        );

      case 'profiles':
        return (
          <GenericCrud
            title="Perfis (Profiles)"
            endpoint="/profile"
            updateMethod="patch"
            columns={[{ key: 'name', label: 'Nome do Perfil' }]}
            fields={[{ name: 'name', label: 'Nome do Perfil', type: 'text', required: true }]}
          />
        );

      case 'addresses':
        return (
          <GenericCrud
            title="Endereços"
            endpoint="/address"
            updateMethod="patch"
            columns={[
              { key: 'street', label: 'Logradouro' },
              { key: 'city', label: 'Cidade' },
              { key: 'state', label: 'UF' },
              { key: 'zipCode', label: 'CEP' },
            ]}
            fields={[
              { name: 'street', label: 'Logradouro / Rua', type: 'text', required: true },
              { name: 'number', label: 'Número', type: 'number', required: true },
              { name: 'city', label: 'Cidade', type: 'text', required: true },
              { name: 'state', label: 'Estado (UF)', type: 'text', required: true },
              { name: 'zipCode', label: 'CEP', type: 'text', required: true },
              { name: 'userId', label: 'ID do Usuário', type: 'text', required: true },
            ]}
          />
        );

      // ---- CINEMA ----
      case 'cinemas':
        return (
          <GenericCrud
            title="Cinemas"
            endpoint="/cinema"
            updateMethod="put"
            columns={[
              { key: 'nome', label: 'Nome' },
              { key: 'endereco', label: 'Endereço' },
            ]}
            fields={[
              { name: 'nome', label: 'Nome do Cinema', type: 'text', required: true },
              { name: 'endereco', label: 'Endereço Completo', type: 'text', required: true, fullWidth: true },
            ]}
          />
        );

      case 'filmes':
        return (
          <GenericCrud
            title="Filmes"
            endpoint="/filmes"
            updateMethod="put"
            columns={[
              { key: 'titulo', label: 'Título' },
              { key: 'genero', label: 'Gênero' },
              { key: 'classificacao', label: 'Classificação' },
              { key: 'cinemaId', label: 'Cinema ID' },
            ]}
            fields={[
              { name: 'titulo', label: 'Título', type: 'text', required: true },
              { name: 'classificacao', label: 'Classificação (ex: 14)', type: 'text', required: false },
              { name: 'duracao', label: 'Duração (data/hora ISO, ex: 2000-01-01T02:00:00.000Z)', type: 'text', required: true },
              { name: 'elenco', label: 'Elenco', type: 'text', required: false },
              {
                name: 'genero',
                label: 'Gênero',
                type: 'select',
                required: false,
                options: GENERO_OPTIONS,
              },
              { name: 'dataInicioExibicao', label: 'Início Exibição (YYYY-MM-DD)', type: 'date', required: false },
              { name: 'dataFinalExibicao', label: 'Fim Exibição (YYYY-MM-DD)', type: 'date', required: false },
              { name: 'cinemaId', label: 'ID do Cinema', type: 'number', required: true },
              { name: 'sinopse', label: 'Sinopse', type: 'textarea', required: false, fullWidth: true },
            ]}
          />
        );

      case 'salas':
        return (
          <GenericCrud
            title="Salas"
            endpoint="/salas"
            updateMethod="put"
            columns={[
              { key: 'numero', label: 'Número da Sala' },
              { key: 'capacidade', label: 'Capacidade' },
              { key: 'cinemaId', label: 'Cinema ID' },
            ]}
            fields={[
              { name: 'numero', label: 'Número da Sala', type: 'number', required: true },
              { name: 'capacidade', label: 'Capacidade (lugares)', type: 'number', required: true },
              { name: 'cinemaId', label: 'ID do Cinema', type: 'number', required: true },
            ]}
          />
        );

      case 'sessoes':
        return (
          <GenericCrud
            title="Sessões"
            endpoint="/sessoes"
            updateMethod="put"
            columns={[
              { key: 'horarioExibicao', label: 'Horário', render: (v) => v ? new Date(v).toLocaleString('pt-BR') : '-' },
              { key: 'filmeId', label: 'Filme ID' },
              { key: 'salaId', label: 'Sala ID' },
              { key: 'cinemaId', label: 'Cinema ID' },
            ]}
            fields={[
              { name: 'horarioExibicao', label: 'Horário de Exibição', type: 'datetime-local', required: true },
              { name: 'filmeId', label: 'ID do Filme', type: 'number', required: true },
              { name: 'salaId', label: 'ID da Sala', type: 'number', required: true },
              { name: 'cinemaId', label: 'ID do Cinema', type: 'number', required: true },
            ]}
          />
        );

      // ---- VENDAS ----
      case 'lanches':
        return (
          <GenericCrud
            title="Lanches / Combos"
            endpoint="/lanches"
            updateMethod="put"
            columns={[
              { key: 'nome', label: 'Nome' },
              { key: 'valorUnitario', label: 'Valor Unit. (R$)' },
              { key: 'quantidade', label: 'Qtd.' },
              { key: 'subtotal', label: 'Subtotal (R$)' },
            ]}
            fields={[
              { name: 'nome', label: 'Nome do Lanche / Combo', type: 'text', required: true },
              { name: 'descricao', label: 'Descrição', type: 'textarea', required: false, fullWidth: true },
              { name: 'valorUnitario', label: 'Valor Unitário (R$)', type: 'number', required: true },
              { name: 'quantidade', label: 'Quantidade', type: 'number', required: true },
              { name: 'subtotal', label: 'Subtotal (R$)', type: 'number', required: true },
            ]}
          />
        );

      case 'ingressos':
        return (
          <GenericCrud
            title="Ingressos"
            endpoint="/ingressos"
            updateMethod="put"
            columns={[
              { key: 'sessaoId', label: 'ID da Sessão' },
              { key: 'valorInteira', label: 'R$ Inteira' },
              { key: 'valorMeia', label: 'R$ Meia' },
            ]}
            fields={[
              { name: 'sessaoId', label: 'ID da Sessão', type: 'number', required: true },
              { name: 'valorInteira', label: 'Valor da Inteira (R$)', type: 'number', required: true },
              { name: 'valorMeia', label: 'Valor da Meia (R$)', type: 'number', required: true },
              { name: 'pedidoId', label: 'ID do Pedido (opcional)', type: 'number', required: false },
            ]}
          />
        );

      case 'pedidos':
        return <PedidosAdminView />;

      // ---- HOME ----
      default:
        return (
          <div>
            <div className="card bg-dark text-light border-secondary mb-4">
              <div className="card-body py-4 text-center">
                <i className="bi bi-shield-lock-fill text-warning display-1 mb-3"></i>
                <h2 className="text-warning fw-bold">Painel de Controle</h2>
                <p className="text-secondary mb-0">
                  Bem-vindo, <strong className="text-warning">{user.name}</strong>! Você possui acesso administrativo completo.
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="row g-3">
              {NAV_GROUPS.flatMap((g) => g.items).map(({ tab, label, icon }) => (
                <div key={tab} className="col-6 col-md-4 col-lg-3">
                  <div
                    className="card bg-black border-secondary h-100 text-center p-3"
                    onClick={() => setActiveTab(tab)}
                    style={{ cursor: 'pointer', transition: 'border-color .2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#ffc107')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
                  >
                    <i className={`bi ${icon} text-warning fs-2 mb-2`}></i>
                    <div className="text-light fw-semibold small">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 mb-4 mb-md-0">
          <div className="card bg-black border-secondary h-100">
            <div className="card-body p-2 d-flex flex-column gap-1">
              {/* Dashboard home button */}
              <button
                onClick={() => setActiveTab('home')}
                className={`btn text-start text-light w-100 mb-1 ${
                  activeTab === 'home'
                    ? 'border-warning border-start border-3 bg-warning bg-opacity-10'
                    : 'border-0'
                }`}
              >
                <i className="bi bi-house-door me-2"></i>Dashboard
              </button>

              {NAV_GROUPS.map((group) => (
                <div key={group.title}>
                  <div className="text-secondary text-uppercase fw-bold px-2 pb-1 mt-2" style={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}>
                    <i className={`bi ${group.icon} me-1`}></i>
                    {group.title}
                  </div>
                  {group.items.map(({ tab, label, icon }) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`btn text-start text-light w-100 py-1 ${
                        activeTab === tab
                          ? 'border-warning border-start border-3 bg-warning bg-opacity-10'
                          : 'border-0'
                      }`}
                      style={{ fontSize: '0.88rem' }}
                    >
                      <i className={`bi ${icon} me-2`}></i>
                      {label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="col-md-9 col-lg-10">{renderContent()}</div>
      </div>
    </div>
  );
}
