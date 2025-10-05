import { Badge } from "@/components/ui/badge";
import type { TReportStatus } from "@/types/reports.type";

export const getReportStatusBadge = (statut: TReportStatus) => {
    type TBadgeVariant = "secondary" | "default" | "outline" | "destructive" | null | undefined;

    const variants: Record<TReportStatus, { variant: TBadgeVariant, label: string }> = {
        recu:               { variant: 'default',       label: 'Reçu' },
        prise_en_charge:    { variant: 'secondary',     label: 'Prise en charge' },
        confirme:           { variant: 'default',       label: 'Confirmé' },
        annule:             { variant: 'destructive',   label: 'Annulé' },
        en_cours:           { variant: 'outline',       label: 'En cours' },
        traite:             { variant: 'outline',       label: 'Traité' },
        cloture:            { variant: 'outline',       label: 'Clôturé' }
    };

    const config = variants[statut] || 'outline';
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
};