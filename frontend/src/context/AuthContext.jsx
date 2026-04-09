import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Simulação de autenticação (tem que estar disponivel para vc poder utilizar)
const ADMIN_CREDENTIALS = { user: 'admin', pass: 'jersey2024' };

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');

  const login = (user, pass) => {
    if (user === ADMIN_CREDENTIALS.user && pass === ADMIN_CREDENTIALS.pass) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
