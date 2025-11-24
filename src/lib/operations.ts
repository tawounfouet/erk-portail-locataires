import { TOperationStatus } from "@/types/operations.type";
  
export function getReportStatusMessage(status: TOperationStatus)
{
    const config: Record<TOperationStatus, string> = {
        CREATED: 'Reçu' ,
        PENDING_VALIDATION: 'Prise en charge',
        APPROVED: 'Confirmé',
        REJECTED: 'Annulé',
        IN_PROGRESS: 'En cours',
        COMPLETED: 'Traité',
        CANCELLED: 'Clôturé',
        ON_HOLD: 'En attente'
    };
    
    return config[status];
};

export function getReportPercentageStyle(percent: string | number): string
{
    let value;
    if (typeof percent === 'number')
    {
        value = percent;
    }
    else
    {
        value = parseInt(percent);
    }

    if (value < 1/8)
    {
        return "w-0";
    }
    else if (value < 2/8)
    {
        return "w-1/8";
    }
    else if (value < 3/8)
    {
        return "w-2/8";
    }
    else if (value < 4/8)
    {
        return "w-3/8";
    }
    else if (value < 5/8)
    {
        return "w-4/8";
    }
    else if (value < 6/8)
    {
        return "w-5/8";
    }
    else if (value < 7/8)
    {
        return "w-6/8";
    }
    else{
        return "w-full";
    }
}