import { useState, useEffect } from 'react';
import OperationService from '@/services/operations';
import { IOperationFilters, IOperationList } from '@/types/operations.type';

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