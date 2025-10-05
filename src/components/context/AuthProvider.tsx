import { authService } from "@/services/auth";
import { IAuthContextType, IUser } from "@/types/user.type";
import { createContext, useCallback, useEffect, useState } from "react";

export const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authentication
  const checkAuth = useCallback(async () => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        setUser(null);
        return;
      }
      
      // Server-side checking
      const userData = await authService.verifyToken(token);
      
      if (userData) {
        setUser(userData);
      } else {
        // Invalid or expired token
        authService.clearToken();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      authService.clearToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const result = await authService.authenticate(email, password);
      
      if (result && result.token && result.user) {
        authService.setToken(result.token, result.expiresIn);
        setUser(result.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // API call for token invalidation
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
      },
    }).catch(console.error);
    
    authService.clearToken();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}