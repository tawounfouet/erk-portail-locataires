// hooks/useCurrentUser.ts
import { useState, useEffect } from 'react';
import AuthService from '@/services/auth';
import { IUser } from '@/types/user.type';

/**
 * Custom hook to retrieve information about the logged-in user
 * @param options - Hook configuration options
 * @returns Object containing the user, loading status, errors, and a reload function
 */
export function useCurrentUser(options: {
  autoFetch?: boolean; // If true, automatically loads data on component mounting
  refetchOnMount?: boolean; // If true, reloads data on each mount
} = {}) {
  const { autoFetch = true, refetchOnMount = true } = options;

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load user data
   */
  const fetchCurrentUser = async (): Promise<IUser | null> => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        console.warn('❌ Aucun token d\'authentification trouvé');
        setError('Utilisateur non authentifié');
        return null;
      }

      // Get user infos
      const userData = await AuthService.getCurrentUser();
      
      if (!userData) {
        throw new Error('Impossible de récupérer les informations utilisateur');
      }

      setUser(userData);
      return userData;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des informations utilisateur';
      console.error('❌ Erreur useCurrentUser:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reload user data
   */
  const refetch = async (): Promise<IUser | null> => {
    return await fetchCurrentUser();
  };

  /**
   * Reset user data cache
   */
  const reset = (): void => {
    setUser(null);
    setLoading(false);
    setError(null);
  };

  // Effect to automatically load data
  useEffect(() => {
    if (autoFetch) {
      fetchCurrentUser();
    }
  }, [autoFetch]);

  // Effect to recharge when mounting if requested
  useEffect(() => {
    if (refetchOnMount && autoFetch) {
      fetchCurrentUser();
    }
  }, [refetchOnMount, autoFetch]);

  return {
    // State
    user,
    loading,
    error,
    
    // Derived data
    isAuthenticated: !!user,
    // userRole: user?.role,
    userFullName: user?.full_name || `${user?.first_name} ${user?.last_name}`.trim(),
    
    // Actions
    refetch,
    reset,
  };
}

// Pre-configured useCurrentUser hook shortcut
export const useUser = () => useCurrentUser({ autoFetch: true, refetchOnMount: false });