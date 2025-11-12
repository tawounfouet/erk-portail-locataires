import AuthService from "@/services/auth";
import { ILoginResponse } from "@/types/auth.type";
import { IAuthContextType, IUser } from "@/types/user.type";
import { createContext, useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { toast } = useToast();

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
      
      const result: ILoginResponse = await AuthService.authenticate(email, password);
      
      if (result.success && result.token && result.user) 
      {
        setUser(result.user);
        return true;
      }
      else if (!result.success && result.response_status)
      {
        switch (result.response_status)
        {
          case 401:
            toast({
              variant: "destructive",
              title: "Hmmm... Tu es sûre de tes informations ?",
              description: "Vérifies et ressaisies tes identifiants de connexion pour voir.",
              action: <ToastAction altText="Try again" onClick={() => {login(email, password)}}>Réessayer</ToastAction>,
            });
          break;

          case 500:
            toast({
              variant: "destructive",
              title: "Oups ! Il y a eu un problème.",
              description: "Il y a peut-être un petit soucis avec le serveur...",
              action: <ToastAction altText="Try again" onClick={() => {login(email, password)}}>Réessayer</ToastAction>,
            });
          break;
        }
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