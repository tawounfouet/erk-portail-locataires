import SuggestionService from "@/services/suggestions";
import { ISuggestionDetail, ISuggestionFilters } from "@/types/suggestions.type";
import { useEffect, useState } from "react";

export function useMySuggestions(filters: ISuggestionFilters = {})
{
    const [suggestions, setSuggestions] = useState<ISuggestionDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        let bMounted = true;

        const fetchSuggestions = async () => {
            try {
                setLoading(true);
                setError(null);

                const userSuggestions = await SuggestionService.getMySuggestions(filters);

                if (bMounted)
                {
                    setSuggestions(userSuggestions.results);
                }
            } catch (err) {
                if (bMounted)
                {
                    console.error('Erreur lors du chargement des opérations: ', err);
                    setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement de vos suggestions.');
                }
            } finally {
                if (bMounted)
                {
                    setLoading(false);
                }
            }
        };

        fetchSuggestions();

        return () => {
            bMounted = false; // cleanup
        };
    }, [filters.author]);

    return { suggestions, loading, error };
}