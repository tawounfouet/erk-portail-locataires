import { useState, useEffect, useCallback } from 'react';
import OperationService from '@/services/operations';
import { IOperationCategory, IOperationFilters, IOperationList, IOperationType, TOperationCategory } from '@/types/operations.type';

/**
 * Custom hook to retrieve user operations
 * @param filters - Optional filters for operations
 * @returns Object containing operations, loading status, and errors
 */
export function useMyOperations(filters : IOperationFilters = {}) {
    const [operations, setOperations] = useState<IOperationList[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let bMounted = true;

        const fetchOperations = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const userOperations = await OperationService.getMyOperations(filters);

                if (bMounted)
                {
                    setOperations(userOperations);
                }
                
            } catch (err) {
                if (bMounted)
                {
                    console.error('Erreur lors du chargement des opérations:', err);
                    setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des opérations');
                }
            } finally {
                if (bMounted)
                {
                    setLoading(false);
                }
            }
        };

        fetchOperations();

        return () => {
            bMounted = false; // cleanup
        }
    }, [filters.operation_type]); // Specific dependence to the operation type

    return { operations, loading, error };
}

interface IUseOperationTypesProps {
  category?: TOperationCategory;
  requires_approval?: boolean;
  is_active?: boolean;
  search?: string;
  ordering?: string;
  autoFetch?: boolean;
}

interface IUseOperationTypesReturn {
    // Data
    operationTypes: Map<string, IOperationType>;
    operationTypesList: IOperationType[]; // Optionnel: pour la compatibilité
    selectedType: IOperationType | null;
  
    // Pagination
    pagination: {
        count: number;
        next: string | null;
        previous: string | null;
        page: number;
    };
    
    // State
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    
    // Actions
    fetchOperationTypes: (page?: number) => Promise<void>;
    fetchOperationTypeById: (id: string) => Promise<void>;
    refetch: () => Promise<void>;
    
    // Filters
    setFilters: (filters: Partial<IUseOperationTypesProps>) => void;
    setSearch: (search: string) => void;
    setCategory: (category: TOperationCategory | undefined) => void;
    setRequiresApproval: (requiresApproval: boolean | undefined) => void;
    
    // Pagination
    goToNextPage: () => Promise<void>;
    goToPreviousPage: () => Promise<void>;
    goToPage: (page: number) => Promise<void>;
}

/**
 * Hook for managing operation types with filtering, pagination and caching
 */
export const useOperationTypes = (initialProps: IUseOperationTypesProps = {}): IUseOperationTypesReturn => {
    const {
        category,
        requires_approval,
        is_active = true,
        search,
        ordering = 'name',
        autoFetch = true
    } = initialProps;

    // State
    const [operationTypes, setOperationTypes] = useState<Map<string, IOperationType>>(new Map());
    const [selectedType, setSelectedType] = useState<IOperationType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // Pagination
    const [pagination, setPagination] = useState({
        count: 0,
        next: null as string | null,
        previous: null as string | null,
        page: 1
    });

    // Filters
    const [filters, setFilters] = useState<IUseOperationTypesProps>({
        category,
        requires_approval,
        is_active,
        search,
        ordering
    });

    // Cache for individual types
    const [typesCache, setTypesCache] = useState<Map<string, IOperationType>>(new Map());

    /**
     * Fetch operation types with current filters and pagination
     */
    const fetchOperationTypes = useCallback(async (page: number = 1) => {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        try {
            const response = await OperationService.getOperationTypes({
                ...filters,
                page
            });

            const newTypesMap = new Map<string, IOperationType>();
            response.results.forEach(type => {
                newTypesMap.set(type.id, type);
            });

            setOperationTypes(newTypesMap);
            setPagination({
                count: response.count,
                next: response.next,
                previous: response.previous,
                page
            });

            // Update cache with new types
            const newCache = new Map(typesCache);
            response.results.forEach(type => {
                newCache.set(type.id, type);
            });
            setTypesCache(newCache);

        } catch (err) {
            setIsError(true);
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des types d\'opérations');
            console.error('Error fetching operation types:', err);
        } finally {
            setIsLoading(false);
        }
    }, [filters, typesCache]);


    /**
     * Fetch a specific operation type by ID
     */
    const fetchOperationTypeById = useCallback(async (id: string) => {
        // Check cache first
        const cachedType = typesCache.get(id);
        if (cachedType) {
        setSelectedType(cachedType);
        return;
        }

        setIsLoading(true);
        setIsError(false);
        setError(null);

        try {
        const operationType = await OperationService.getOperationTypeById(id);
        setSelectedType(operationType);

        // Update cache
        const newCache = new Map(typesCache);
        newCache.set(id, operationType);
        setTypesCache(newCache);

        } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement du type d\'opération');
        console.error('Error fetching operation type by ID:', err);
        } finally {
        setIsLoading(false);
        }
    }, [typesCache]);

    /**
     * Update filters and refetch data
     */
    const updateFilters = useCallback((newFilters: Partial<IUseOperationTypesProps>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    /**
     * Set search term and reset to page 1
     */
    const setSearch = useCallback((searchTerm: string) => {
        setFilters(prev => ({ ...prev, search: searchTerm }));
    }, []);

    /**
     * Set category filter and reset to page 1
     */
    const setCategory = useCallback((newCategory: TOperationCategory | undefined) => {
        setFilters(prev => ({ ...prev, category: newCategory }));
    }, []);

    /**
     * Set requires approval filter and reset to page 1
     */
    const setRequiresApproval = useCallback((requiresApproval: boolean | undefined) => {
        setFilters(prev => ({ ...prev, requires_approval: requiresApproval }));
    }, []);

    /**
     * Pagination handlers
     */
    const goToNextPage = useCallback(async () => {
        if (pagination.next) {
        const nextPage = pagination.page + 1;
        await fetchOperationTypes(nextPage);
        }
    }, [pagination.next, pagination.page, fetchOperationTypes]);

    const goToPreviousPage = useCallback(async () => {
        if (pagination.previous) {
        const prevPage = pagination.page - 1;
        await fetchOperationTypes(prevPage);
        }
    }, [pagination.previous, pagination.page, fetchOperationTypes]);

    const goToPage = useCallback(async (page: number) => {
        await fetchOperationTypes(page);
    }, [fetchOperationTypes]);

    /**
     * Refetch current data
     */
    const refetch = useCallback(async () => {
        await fetchOperationTypes(pagination.page);
    }, [fetchOperationTypes, pagination.page]);

    // Auto-fetch on mount and when filters change
    useEffect(() => {
        if (autoFetch) {
            fetchOperationTypes(1);
        }
    }, []);


    const operationTypesList = Array.from(operationTypes.values());

    return {
        // Data
        operationTypes,
        operationTypesList,
        selectedType,
        
        // Pagination
        pagination,
        
        // State
        isLoading,
        isError,
        error,
        
        // Actions
        fetchOperationTypes,
        fetchOperationTypeById,
        refetch,
        
        // Filters
        setFilters: updateFilters,
        setSearch,
        setCategory,
        setRequiresApproval,
        
        // Pagination
        goToNextPage,
        goToPreviousPage,
        goToPage
    };
};

interface UseOperationCategoriesProps {
    is_active?: boolean;
    code?: string;
    search?: string;
    ordering?: string;
    autoFetch?: boolean;
}

interface UseOperationCategoriesReturn {
    // Data
    operationCategories: Map<string, IOperationCategory>;
    operationCategoriesList: IOperationCategory[];

    // Pagination
    pagination: {
    count: number;
    next: string | null;
    previous: string | null;
    page: number;
    };

    // State
    isLoading: boolean;
    isError: boolean;
    error: string | null;

    // Actions
    fetchOperationCategories: (page?: number) => Promise<void>;
    refetch: () => Promise<void>;

    // Filters
    setFilters: (filters: Partial<UseOperationCategoriesProps>) => void;
    setSearch: (search: string) => void;
    setIsActive: (isActive: boolean | undefined) => void;
    setCode: (code: string | undefined) => void;
}

/**
 * Hook for managing operation categories with filtering and caching
 */
export const useOperationCategories = (initialProps: UseOperationCategoriesProps = {}): UseOperationCategoriesReturn => {
    const {
        is_active = true,
        code,
        search,
        ordering = 'sort_order,name',
        autoFetch = true
    } = initialProps;

    // State
    const [operationCategories, setOperationCategories] = useState<Map<string, IOperationCategory>>(new Map());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    // Pagination
    const [pagination, setPagination] = useState({
        count: 0,
        next: null as string | null,
        previous: null as string | null,
        page: 1
    });

    // Filters
    const [filters, setFilters] = useState<UseOperationCategoriesProps>({
        is_active,
        code,
        search,
        ordering
    });

    /**
     * Fetch operation categories with current filters
     */
    const fetchOperationCategories = useCallback(async (page: number = 1) => {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        try {
            const response = await OperationService.getOperationCategories({
                ...filters,
                page
            });

            // Create Map with operation categories
            const categoriesMap = new Map<string, IOperationCategory>();
            response.results.forEach(category => {
                categoriesMap.set(category.id, category);
            });

            setOperationCategories(categoriesMap);
            setPagination({
                count: response.count,
                next: response.next,
                previous: response.previous,
                page
            });

        } catch (err) {
            setIsError(true);
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des catégories d\'opérations');
            console.error('Error fetching operation categories:', err);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    /**
     * Update filters and refetch data
     */
    const updateFilters = useCallback((newFilters: Partial<UseOperationCategoriesProps>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    /**
     * Set search term
     */
    const setSearch = useCallback((searchTerm: string) => {
        setFilters(prev => ({ ...prev, search: searchTerm }));
    }, []);

    /**
     * Set active filter
     */
    const setIsActive = useCallback((isActive: boolean | undefined) => {
        setFilters(prev => ({ ...prev, is_active: isActive }));
    }, []);

    /**
     * Set code filter
     */
    const setCode = useCallback((codeFilter: string | undefined) => {
        setFilters(prev => ({ ...prev, code: codeFilter }));
    }, []);

    /**
     * Refetch current data
     */
    const refetch = useCallback(async () => {
        await fetchOperationCategories(pagination.page);
    }, [fetchOperationCategories, pagination.page]);

    // Auto-fetch on mount and when filters change
    useEffect(() => {
        if (autoFetch) {
        fetchOperationCategories(1);
        }
    }, [filters, autoFetch, fetchOperationCategories]);

    return {
        // Data
        operationCategories,
        operationCategoriesList: Array.from(operationCategories.values()),
        
        // Pagination
        pagination,
        
        // State
        isLoading,
        isError,
        error,
        
        // Actions
        fetchOperationCategories,
        refetch,
        
        // Filters
        setFilters: updateFilters,
        setSearch,
        setIsActive,
        setCode
    };
};

// =========================================================================
// SPECIALIZED HOOKS
// =========================================================================

/**
 * Hook for active operation categories only
 */
export const useActiveOperationCategories = () => {
    return useOperationCategories({
        is_active: true,
        ordering: 'sort_order,name'
    });
};

/**
 * Hook for operation categories by code
 */
export const useOperationCategoriesByCode = (code: string) => {
    return useOperationCategories({
        code,
        is_active: true
    });
};

/**
 * Hook for a single operation category
 */
export const useOperationCategory = (id?: string) => {
  const [operationCategory, setOperationCategory] = useState<IOperationCategory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOperationCategory = useCallback(async (categoryId: string) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const category = await OperationService.getOperationCategoryById(categoryId);
      setOperationCategory(category);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la catégorie d\'opération');
      console.error('Error fetching operation category:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchOperationCategory(id);
    } else {
      setOperationCategory(null);
    }
  }, [id, fetchOperationCategory]);

  return {
    operationCategory,
    isLoading,
    isError,
    error,
    refetch: () => id ? fetchOperationCategory(id) : Promise.resolve()
  };
};

/**
 * Hook for operation categories grouped by usage (with counts)
 */
export const useOperationCategoriesWithStats = () => {
  const [categoriesWithStats, setCategoriesWithStats] = useState<Map<string, IOperationCategory>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoriesWithStats = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      // Fetch categories sorted by operation types count
      const response = await OperationService.getOperationCategories({
        is_active: true,
        ordering: '-operation_types_count,sort_order,name'
      });

      const categoriesMap = new Map<string, IOperationCategory>();
      response.results.forEach(category => {
        categoriesMap.set(category.id, category);
      });

      setCategoriesWithStats(categoriesMap);

    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des catégories avec statistiques');
      console.error('Error fetching categories with stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesWithStats();
  }, [fetchCategoriesWithStats]);

  return {
    operationCategories: categoriesWithStats,
    operationCategoriesList: Array.from(categoriesWithStats.values()),
    isLoading,
    isError,
    error,
    refetch: fetchCategoriesWithStats
  };
};