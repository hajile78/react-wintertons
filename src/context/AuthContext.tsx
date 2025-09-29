import { createContext, useContext, useState, ReactNode } from 'react';
import { auth, User, LoginCredentials } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(auth.getUser());

  const login = async (credentials: LoginCredentials) => {
    const response = await auth.login(credentials);
    setUser(response.user);
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  const hasRole = (role: string) => {
    return user ? user.roles.includes(role) : false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
