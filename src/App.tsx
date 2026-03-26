import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Filmes from './pages/Filmes';
import Salas from './pages/Salas';
import Sessoes from './pages/Sessoes';
import Lanches from './pages/Lanches';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/admin/AdminDashboard';
import MeusPedidos from './pages/MeusPedidos';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-dark">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/filmes" element={<Filmes />} />
          <Route path="/sessoes" element={<Sessoes />} />
          <Route path="/salas" element={<Salas />} />
          <Route path="/lanches" element={<Lanches />} />
          
          {/* Rotas Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Rotas do Usuário */}
          <Route path="/meus-pedidos" element={<MeusPedidos />} />
          
          {/* Rotas de Autenticação */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
export default App;