import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import GenericCrud from './GenericCrud';

type AdminTab = 'home' | 'users' | 'profiles' | 'addresses' | 'cinemas' | 'ingressos' | 'pedidos';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('home');

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <GenericCrud 
          title="Usuários" endpoint="/user" updateMethod="patch"
          columns={[ { key: 'name', label: 'Nome' }, { key: 'email', label: 'E-mail' } ]}
          fields={[
            { name: 'name', label: 'Nome', type: 'text', required: true },
            { name: 'email', label: 'E-mail', type: 'email', required: true },
            { name: 'password', label: 'Senha', type: 'password', required: false },
            { name: 'profileId', label: 'ID do Perfil (1=Admin, 2=Common)', type: 'number', required: true }
          ]}
        />;
      case 'profiles':
        return <GenericCrud 
          title="Perfis (Profiles)" endpoint="/profile" updateMethod="patch"
          columns={[ { key: 'name', label: 'Nome do Perfil' } ]}
          fields={[ { name: 'name', label: 'Nome do Perfil', type: 'text', required: true } ]}
        />;
      case 'addresses':
        return <GenericCrud 
          title="Endereços" endpoint="/address" updateMethod="patch"
          columns={[ { key: 'street', label: 'Rua' }, { key: 'city', label: 'Cidade' }, { key: 'userId', label: 'User ID' } ]}
          fields={[
            { name: 'street', label: 'Logradouro', type: 'text', required: true },
            { name: 'number', label: 'Número', type: 'number', required: true },
            { name: 'city', label: 'Cidade', type: 'text', required: true },
            { name: 'state', label: 'Estado (UF)', type: 'text', required: true },
            { name: 'zipCode', label: 'CEP', type: 'text', required: true },
            { name: 'userId', label: 'ID do Usuário', type: 'number', required: true }
          ]}
        />;
      case 'cinemas':
        return <GenericCrud 
          title="Cinemas" endpoint="/cinema" updateMethod="put"
          columns={[ { key: 'nome', label: 'Nome' }, { key: 'endereco', label: 'Endereço' } ]}
          fields={[
            { name: 'nome', label: 'Nome do Cinema', type: 'text', required: true },
            { name: 'endereco', label: 'Endereço Completo', type: 'text', required: true }
          ]}
        />;
      case 'ingressos':
        return <GenericCrud 
          title="Ingressos" endpoint="/ingressos" updateMethod="put"
          columns={[ { key: 'sessaoId', label: 'ID da Sessão' }, { key: 'valorInteira', label: 'R$ Inteira' } ]}
          fields={[
            { name: 'sessaoId', label: 'ID da Sessão Relacionada', type: 'number', required: true },
            { name: 'valorInteira', label: 'Valor da Inteira', type: 'number', required: true },
            { name: 'valorMeia', label: 'Valor da Meia', type: 'number', required: true },
            { name: 'tipo', label: 'Tipo (Inteira / Meia)', type: 'text', required: false }
          ]}
        />;
      case 'pedidos':
        return <GenericCrud 
          title="Pedidos" endpoint="/pedidos" updateMethod="put"
          columns={[ { key: 'valorTotal', label: 'Valor Total (R$)' }, { key: 'qtInteira', label: 'Qtd Inteiras' } ]}
          fields={[
            { name: 'qtInteira', label: 'Inteiras', type: 'number', required: true },
            { name: 'qtMeia', label: 'Meias', type: 'number', required: true },
            { name: 'valorTotal', label: 'Valor Total', type: 'number', required: true }
          ]}
        />;
      default:
        return (
          <div className="card bg-dark text-light border-secondary">
            <div className="card-body py-5 text-center">
              <i className="bi bi-shield-lock-fill text-warning display-1 mb-4"></i>
              <h2 className="text-warning fw-bold">Painel de Controle Administrador</h2>
              <p className="text-secondary mb-4">Bem-vindo, {user.name}! Você possui acesso total aos cadastros do sistema.</p>
              
              <div className="row g-4 justify-content-center mt-2">
                <div className="col-md-4">
                  <div className="p-4 border border-secondary rounded bg-black cursor-pointer align-items-center" onClick={() => setActiveTab('users')} style={{cursor: 'pointer'}}>
                    <i className="bi bi-people-fill fs-2 text-warning mb-2"></i>
                    <h5>Usuários</h5>
                    <small className="text-secondary">Gerencie contas e perfis</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-4 border border-secondary rounded bg-black cursor-pointer align-items-center" onClick={() => setActiveTab('cinemas')} style={{cursor: 'pointer'}}>
                    <i className="bi bi-building fs-2 text-warning mb-2"></i>
                    <h5>Cinemas</h5>
                    <small className="text-secondary">Redes e filiais</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <Link to="/filmes" className="text-decoration-none">
                    <div className="p-4 border border-secondary rounded bg-black cursor-pointer align-items-center" style={{cursor: 'pointer'}}>
                      <i className="bi bi-camera-reels-fill fs-2 text-warning mb-2"></i>
                      <h5 className="text-light">Filmes</h5>
                      <small className="text-secondary">Catálogo principal</small>
                    </div>
                  </Link>
                </div>
              </div>
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
            <div className="card-body p-3 d-flex flex-column gap-2">
              <h6 className="text-secondary text-uppercase fw-bold mb-3 fs-7">
                <i className="bi bi-database me-2"></i>Banco de Dados
              </h6>
              
              <button onClick={() => setActiveTab('home')} className={`btn text-start text-light ${activeTab === 'home' ? 'bg-secondary bg-opacity-25 border-warning border-start border-3' : 'border-0'}`}>
                <i className="bi bi-house-door me-2"></i>Dashboard
              </button>

              <hr className="border-secondary my-1" />

              <button onClick={() => setActiveTab('users')} className={`btn text-start text-light ${activeTab === 'users' ? 'bg-secondary bg-opacity-25 border-warning border-start border-3' : 'border-0'}`}>
                <i className="bi bi-person me-2"></i>Usuários
              </button>
              <button onClick={() => setActiveTab('profiles')} className={`btn text-start text-light ${activeTab === 'profiles' ? 'bg-secondary bg-opacity-25 border-warning border-start border-3' : 'border-0'}`}>
                <i className="bi bi-file-earmark-person me-2"></i>Perfis (Profile)
              </button>
              <button onClick={() => setActiveTab('addresses')} className={`btn text-start text-light ${activeTab === 'addresses' ? 'bg-secondary bg-opacity-25 border-warning border-start border-3' : 'border-0'}`}>
                <i className="bi bi-geo-alt me-2"></i>Endereços
              </button>

              <hr className="border-secondary my-1" />

              <button onClick={() => setActiveTab('cinemas')} className={`btn text-start text-light ${activeTab === 'cinemas' ? 'bg-secondary bg-opacity-25 border-warning border-start border-3' : 'border-0'}`}>
                <i className="bi bi-building me-2"></i>Cinemas
              </button>
              <Link to="/filmes" className="btn text-start text-light border-0">
                <i className="bi bi-camera-reels me-2"></i>Filmes (Externo)
              </Link>
              <Link to="/salas" className="btn text-start text-light border-0">
                <i className="bi bi-door-open me-2"></i>Salas (Externo)
              </Link>
              <Link to="/sessoes" className="btn text-start text-light border-0">
                <i className="bi bi-calendar-event me-2"></i>Sessões (Externo)
              </Link>
              
              <hr className="border-secondary my-1" />

              <Link to="/lanches" className="btn text-start text-light border-0">
                <i className="bi bi-cup-straw me-2"></i>Lanches (Externo)
              </Link>
              <button onClick={() => setActiveTab('ingressos')} className={`btn text-start text-light ${activeTab === 'ingressos' ? 'bg-secondary bg-opacity-25 border-warning border-start border-3' : 'border-0'}`}>
                <i className="bi bi-ticket-perforated me-2"></i>Ingressos
              </button>
              <button onClick={() => setActiveTab('pedidos')} className={`btn text-start text-light ${activeTab === 'pedidos' ? 'bg-secondary bg-opacity-25 border-warning border-start border-3' : 'border-0'}`}>
                <i className="bi bi-cart me-2"></i>Pedidos
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="col-md-9 col-lg-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
