import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

// Tipagem do Usuário logado
export interface User {
  id: string;
  email: string;
  name: string;
  profileId: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
}

// Criação do Contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Sempre que o usuário atualizar a página (F5), recuperamos a sessão
    const storedToken = localStorage.getItem('@Cineweb:token');
    const storedUser = localStorage.getItem('@Cineweb:user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Função chamada após a tela de Login receber a resposta de sucesso da API
  const signIn = (newToken: string, loggedUser: User) => {
    setToken(newToken);
    setUser(loggedUser);

    // Salva no navegador para não perder ao fechar a aba
    localStorage.setItem('@Cineweb:token', newToken);
    localStorage.setItem('@Cineweb:user', JSON.stringify(loggedUser));
  };

  // Função para sair do sistema
  const signOut = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('@Cineweb:token');
    localStorage.removeItem('@Cineweb:user');
  };

  // REGRA DE NEGÓCIO: Supondo que o Perfil de ADMIN no seu banco seja o ID 1
  const isAdmin = user?.profileId === 'profile-admin-001';

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated: !!token, 
        isAdmin, 
        signIn, 
        signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado para facilitar o uso nos componentes (ex: Navbar, Botões)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
