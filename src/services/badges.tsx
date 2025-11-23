import { TOperationStatus } from "@/types/operations.type";

export const getReportStatusBadge = (statut: TOperationStatus) => {
    const variants: Record<TOperationStatus, { bgcolor: string, dotcolor: string, textcolor: string, label: string }> = {
        CREATED:                { dotcolor: 'bg-yellow-500', bgcolor: 'bg-yellow-500/20', textcolor: 'text-yellow-500',       label: 'Reçu' },
        PENDING_VALIDATION:     { dotcolor: 'bg-orange-500',  bgcolor: 'bg-orange-500/20', textcolor: 'text-orange-500',     label: 'Prise en charge' },
        APPROVED:               { dotcolor: 'bg-green-500',  bgcolor: 'bg-green-500/20', textcolor: 'text-green-500',       label: 'Confirmé' },
        REJECTED:               { dotcolor: 'bg-red-500',  bgcolor: 'bg-red-500/20', textcolor: 'text-red-500',            label: 'Annulé' },
        IN_PROGRESS:            { dotcolor: 'bg-green-500',  bgcolor: 'bg-green-500/20', textcolor: 'text-green-500',       label: 'En cours' },
        COMPLETED:              { dotcolor: 'bg-green-500',  bgcolor: 'bg-green-500/20', textcolor: 'text-green-500',       label: 'Traité' },
        CANCELLED:              { dotcolor: 'bg-gray-500',  bgcolor: 'bg-gray-500/20', textcolor: 'text-gray-500',          label: 'Clôturé' },
        ON_HOLD:                { dotcolor: 'bg-green-500',  bgcolor: 'bg-green-500/20', textcolor: 'text-green-500',       label: 'En attente' }
    };

    const config = variants[statut] || 'outline';
    
    return (
        <div className={`flex items-center gap-2 rounded-full ${config.bgcolor} px-2.5 py-1`}>
            <div className={`size-1.5 rounded-full ${config.dotcolor}`}></div>
            <p className={`text-xs font-medium ${config.textcolor}`}>{config.label}</p>
        </div>
    );
};