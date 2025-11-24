import FloatingAddButton from "@/components/common/FloatingAddButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMySuggestions } from "@/hooks/useSuggestions";
import { formatISODateToFrench } from "@/lib/date";
import { ISuggestionDetail } from "@/types/suggestions.type";
import { Badge, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import no_suggestion from "@/assets/images/no_suggestions.webp";


export default function HomeSuggestionWithCardPage()
{
    const { suggestions, loading, error } = useMySuggestions();
    const navigate = useNavigate();


    // États de chargement et d'erreur
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement de vos signalements...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium text-red-800 mb-2">
                    Erreur de chargement
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline"
                >
                    Réessayer
                </Button>


                <FloatingAddButton 
                    onClick={() => navigate('/suggestions/new')}
                />
            </div>
        );
    }

    if (suggestions.length < 1)
    {
        return (
            <>
                <div className="flex flex-col items-center jutify-between gap-4 mt-8">
                    <h1 className="text-2xl font-medium text-white">Aucune suggestion.</h1>
                    
                    <img
                        src={no_suggestion}
                        alt="thinking boy"
                        className="opacity-60"
                    />

                    <p className="text-center text-gray-400">
                        Des idées pour améliorer la vie dans la résidence ?
                    </p>
                </div>

                <FloatingAddButton 
                    onClick={() => navigate('/suggestions/new')}
                />
            </>
        );
    }


    return (
        <>
            {suggestions.map((suggestion: ISuggestionDetail, index: number) => (
                <Card key={`${suggestion.id}${index}`} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer group max-w-2xl w-full">
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-white text-xl font-semibold mb-3">
                                {suggestion.titre}
                            </h3>
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                            <Badge 
                                variant="secondary" 
                                className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-0 font-medium"
                            >
                                {suggestion.status}
                            </Badge>
                            <span>{formatISODateToFrench(suggestion.created_at)}</span>
                            </div>
                        </div>
                    
                        <ChevronRight 
                            className="text-slate-500 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" 
                            size={24}
                        />
                    </div>
                </Card>
            ))}

            <FloatingAddButton 
                onClick={() => navigate('/suggestions/new')}
            />
        </>
    );
}