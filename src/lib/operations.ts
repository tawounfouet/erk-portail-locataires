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

    if (value < 1/5)
    {
        return "w-0";
    }
    else if (value < 2/5)
    {
        return "w-1/5";
    }
    else if (value < 3/5)
    {
        return "w-2/5";
    }
    else if (value < 4/5)
    {
        return "w-3/5";
    }
    else if (value < 5/5)
    {
        return "w-4/5";
    }
    else{
        return "w-full";
    }
}

export function getReportPercentageStyleFromStatus(status: TOperationStatus)
{
    switch (status)
    {
        default: case 'CREATED': return "w-0";
        
        case 'PENDING_VALIDATION': return "w-1/5";
        
        case 'APPROVED': return "w-2/5";
        
        case 'IN_PROGRESS': return "w-3/5";
         
        case 'ON_HOLD': return "w-4/5";
            
        case 'REJECTED': 
        case 'COMPLETED':
        case 'CANCELLED': return "w-full";
    }
}