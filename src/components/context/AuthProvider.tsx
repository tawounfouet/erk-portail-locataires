import AuthService from "@/services/auth";
import { IAuthContextType, IUser } from "@/types/user.type";
import { createContext, useCallback, useEffect, useState } from "react";

export const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authentication
  const checkAuth = useCallback(async () => {
    try {
      const token: string = AuthService.getTokens().access;
      
      if (!token) 
      {
        setUser(null);
        return;
      }
      
      // Server-side checking
      const bValid = await AuthService.verifyToken(token);
      
      if (!bValid) // Invalid or expired token 
      {
        AuthService.clearTokens();
        setUser(null);
        //@TODO: Return this user to login page.
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      AuthService.clearTokens();
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
      
      const result = await AuthService.authenticate(email, password);
      
      if (result && result.token && result.user) 
      {
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
    AuthService.destroyToken();
    
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