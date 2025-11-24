import { useState, useEffect, useCallback } from 'react';
import RentalService from '@/services/rental';
import { 
  ITenant, 
  ITenantListResponse, 
  ITenantFilters,
  ITenantDocument, 
  ITenantDocumentListResponse, 
  ITenantDocumentFilters,
  ICreateTenantDocumentData,
  IUpdateTenantDocumentData,
  ITenantDetail,
  ITenantDetailListResponse
} from '@/types/rental.type';

// ===== HOOKS POUR LES LOCATAIRES =====

/**
 * Hook pour récupérer la liste des locataires
 */
export const useTenants = (filters: ITenantFilters = {}) => {
  const [tenants, setTenants] = useState<ITenant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
  }>({ count: 0, next: null, previous: null });

  const fetchTenants = useCallback(async (filtersParams: ITenantFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response: ITenantListResponse = await RentalService.getTenants(filtersParams);
      setTenants(response.results);
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des locataires:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants(filters);
  }, [fetchTenants, filters]);

  const refetch = useCallback(() => {
    fetchTenants(filters);
  }, [fetchTenants, filters]);

  return {
    tenants,
    loading,
    error,
    pagination,
    refetch
  };
};

/**
 * Hook pour récupérer un locataire spécifique
 */
export const useTenant = (id: string | undefined) => {
  const [tenant, setTenant] = useState<ITenant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenant = useCallback(async (tenantId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await RentalService.getTenantById(tenantId);
      setTenant(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération du locataire:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchTenant(id);
    } else {
      setLoading(false);
      setTenant(null);
    }
  }, [fetchTenant, id]);

  const refetch = useCallback(() => {
    if (id) {
      fetchTenant(id);
    }
  }, [fetchTenant, id]);

  return {
    tenant,
    loading,
    error,
    refetch
  };
};

// ===== HOOKS POUR LES DOCUMENTS LOCATAIRES =====

/**
 * Hook pour récupérer la liste des documents locataires
 */
export const useTenantDocuments = (filters: ITenantDocumentFilters = {}) => {
  const [documents, setDocuments] = useState<ITenantDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
  }>({ count: 0, next: null, previous: null });

  const fetchDocuments = useCallback(async (filtersParams: ITenantDocumentFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response: ITenantDocumentListResponse = await RentalService.getTenantDocuments(filtersParams);
      setDocuments(response.results);
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des documents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments(filters);
  }, [fetchDocuments, filters]);

  const refetch = useCallback(() => {
    fetchDocuments(filters);
  }, [fetchDocuments, filters]);

  return {
    documents,
    loading,
    error,
    pagination,
    refetch
  };
};

/**
 * Hook pour récupérer un document spécifique
 */
export const useTenantDocument = (id: string | undefined) => {
  const [document, setDocument] = useState<ITenantDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocument = useCallback(async (documentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await RentalService.getTenantDocumentById(documentId);
      setDocument(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération du document:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchDocument(id);
    } else {
      setLoading(false);
      setDocument(null);
    }
  }, [fetchDocument, id]);

  const refetch = useCallback(() => {
    if (id) {
      fetchDocument(id);
    }
  }, [fetchDocument, id]);

  return {
    document,
    loading,
    error,
    refetch
  };
};

/**
 * Hook pour les opérations CRUD sur les documents
 */
export const useTenantDocumentMutations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createDocument = useCallback(async (data: ICreateTenantDocumentData): Promise<ITenantDocument | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await RentalService.createTenantDocument(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      console.error('Erreur lors de la création du document:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDocument = useCallback(async (id: string, data: IUpdateTenantDocumentData): Promise<ITenantDocument | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await RentalService.updateTenantDocument(id, data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      console.error('Erreur lors de la mise à jour du document:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDocument = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await RentalService.deleteTenantDocument(id);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      console.error('Erreur lors de la suppression du document:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    clearError
  };
};

/**
 * Hook pour récupérer les documents d'un locataire spécifique
 */
export const useTenantDocumentsByTenant = (tenantId: string | undefined, filters: Omit<ITenantDocumentFilters, 'tenant'> = {}) => {
  const [documents, setDocuments] = useState<ITenantDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await RentalService.getDocumentsByTenant(id, filters);
      setDocuments(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des documents du locataire:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (tenantId) {
      fetchDocuments(tenantId);
    } else {
      setLoading(false);
      setDocuments([]);
    }
  }, [fetchDocuments, tenantId]);

  const refetch = useCallback(() => {
    if (tenantId) {
      fetchDocuments(tenantId);
    }
  }, [fetchDocuments, tenantId]);

  return {
    documents,
    loading,
    error,
    refetch
  };
};


/**
 * Hook pour récupérer le profil locataire de l'utilisateur connecté
 */
export const useMyTenantProfile = (page?: number) => {
  const [profile, setProfile] = useState<ITenantDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
  }>({ count: 0, next: null, previous: null });

  const fetchMyProfile = useCallback(async (pageNumber?: number) => {
    try {
      setLoading(true);
      setError(null);
      const response: ITenantDetailListResponse = await RentalService.getMyTenantProfile(pageNumber);
      
      // Comme c'est le profil de l'utilisateur connecté, on prend le premier résultat
      if (response.results && response.results.length > 0) {
        setProfile(response.results[0]);
      } else {
        setProfile(null);
      }
      
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération du profil locataire:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyProfile(page);
  }, [fetchMyProfile, page]);

  const refetch = useCallback(() => {
    fetchMyProfile(page);
  }, [fetchMyProfile, page]);

  return {
    profile,
    loading,
    error,
    pagination,
    refetch
  };
};