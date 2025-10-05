// components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface IProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[]; // For specific roles
}

export default function ProtectedRoute({ children, requiredRole }: IProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Vérification de sécurité...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Simple redirection for login
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location,
          message: "Veuillez vous connecter pour accéder à cette page"
        }} 
        replace 
      />
    );
  }

  // Roles checking
  if (requiredRole && user) {
    //@TODO : Implement logic for role checking here...
    // const hasRole = checkUserRole(user, requiredRole);
    // if (!hasRole) return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}