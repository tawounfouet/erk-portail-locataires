import { formatISODateToFrenchWithMonth } from "@/lib/date"
import { getSuggestionCategoryMessage, getSuggestionStatusMessage } from "@/lib/suggestions"
import { ISuggestionDetail } from "@/types/suggestions.type"

interface ISuggestionDetailProps
{
    suggestion: ISuggestionDetail
}

export default function SuggestionView({ suggestion }: ISuggestionDetailProps)
{
    return (
        <div 
            key={suggestion.id}
            className="bg-[#2f2014] border border-white/5 rounded-3xl p-6 hover:bg-white/5 transition-all cursor-pointer mt-5"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
            
            <div className="flex justify-between items-start mb-3 relative z-10">
                <span className={`flex items-center justify-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-primary text-primary bg-primary/30`}>
                    <div className={`
                        w-1 h-1 rounded-full bg-primary
                        ${suggestion.status !== 'implemented' && suggestion.status !== 'rejected' ? 'animate-ping' : ''}`
                    }></div> 
                    {getSuggestionStatusMessage(suggestion.status)}
                </span>
                <span className="text-xs text-gray-100">{formatISODateToFrenchWithMonth(suggestion.created_at)}</span>
            </div>
            
            <div className="relative z-10">
            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                {suggestion.titre}
            </h3>
            <p className="text-white text-sm line-clamp-2">
                {suggestion.description}
            </p>
            </div>
            
            <div className="mt-4 flex items-center text-xs text-gray-500 relative z-10">
            <div className="flex items-center gap-1">
                #{getSuggestionCategoryMessage(suggestion.categorie)}
            </div>
            </div>
        </div>
    )
}