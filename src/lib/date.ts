/**
 * Converts a date in yyyy-mm-dd format to dd/mm/yyyy format
 * @param date datestring in the format yyyy-mm-dd
 * @returns datestring in the format dd/mm/yyyy
 * 
 * @example
 * formatDashDateToSlashDate("2024-12-25") => "25/12/2024"
 * formatDashDateToSlashDate("2024-01-05") => "05/01/2024"
 */
export function formatDashDateToSlashDate(date: string)
{
    const y = date.split('-')[0];
    const m = date.split('-')[1];
    const d = date.split('-')[2];

    return `${d}/${m}/${y}`;    
}