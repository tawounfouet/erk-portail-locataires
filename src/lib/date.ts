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

/**
 * Converts a date in yyyy-mm-dd format to dd/mm/yyyy format
 * Includes comprehensive error handling for invalid formats
 * @param date - Date string in the format yyyy-mm-dd
 * @returns Date string in the format dd/mm/yyyy or original string if invalid
 * 
 * @example
 * formatDashDateToSlashDate("2024-12-25") => "25/12/2024"
 * formatDashDateToSlashDate("2024-01-05") => "05/01/2024"
 * formatDashDateToSlashDate("invalid-date") => "invalid-date" (returns original)
 * formatDashDateToSlashDate("2024-13-45") => "2024-13-45" (returns original for invalid date)
 */
export function formatDashDateToFrench(date: string): string
{
    try {
        // Vérifie que la string n'est pas vide
        if (!date || typeof date !== 'string') {
            throw new Error('Date string is empty or not a string');
        }

        // Sépare la date en parties (gère aussi les dates avec timezone en prenant seulement la partie date)
        const datePart = date.split('T')[0]; // Prend seulement la partie avant 'T' si présente
        const parts = datePart.split('-');
        
        // Vérifie le format yyyy-mm-dd
        if (parts.length !== 3) {
            throw new Error('Invalid date format: expected yyyy-mm-dd');
        }

        const [year, month, day] = parts;

        // Valide que chaque partie est numérique
        if (!/^\d+$/.test(year) || !/^\d+$/.test(month) || !/^\d+$/.test(day)) {
            throw new Error('Date contains non-numeric characters');
        }

        // Convertit en nombres pour validation
        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10);
        const dayNum = parseInt(day, 10);

        // Validation basique de la date
        if (yearNum < 1000 || yearNum > 9999) {
            throw new Error('Invalid year: must be between 1000 and 9999');
        }

        if (monthNum < 1 || monthNum > 12) {
            throw new Error('Invalid month: must be between 1 and 12');
        }

        if (dayNum < 1 || dayNum > 31) {
            throw new Error('Invalid day: must be between 1 and 31');
        }

        // Validation plus poussée des jours par mois
        const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
        if (dayNum > daysInMonth) {
            throw new Error(`Invalid day: ${dayNum} is not a valid day for month ${monthNum}`);
        }

        // Formatte avec zero-padding
        const formattedDay = day.padStart(2, '0');
        const formattedMonth = month.padStart(2, '0');

        return `${formattedDay}/${formattedMonth}/${year}`;

    } catch (error) {
        console.warn(`⚠️ Failed to format date "${date}":`, error instanceof Error ? error.message : error);
        
        // Retourne la string originale en cas d'erreur
        return date;
    }
}

/**
 * Converts an ISO 8601 date string to dd/mm/yyyy format
 * Handles various ISO formats including timezone offsets
 * @param isoDateString - Date string in ISO 8601 format (e.g., "2025-11-12T03:53:17.775462+01:00")
 * @returns Date string in dd/mm/yyyy format
 * 
 * @example
 * formatISODateToFrench("2025-11-12T03:53:17.775462+01:00") => "12/11/2025"
 * formatISODateToFrench("2024-01-05T10:30:00Z") => "05/01/2024"
 * formatISODateToFrench("2024-12-25") => "25/12/2024" (also works with simple dates)
 */
export function formatISODateToFrench(isoDateString: string): string
{
    try {
        // Crée un objet Date à partir de la string ISO
        const date = new Date(isoDateString);
        
        // Vérifie si la date est valide
        if (isNaN(date.getTime())) {
            throw new Error('Date invalide');
        }
        
        // Extrait le jour, mois et année
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error('Erreur lors du formatage de la date:', error);
        
        // Fallback: essaie de traiter comme une date simple yyyy-mm-dd
        if (isoDateString.includes('-')) {
            const parts = isoDateString.split('T')[0].split('-'); // Prend seulement la partie date
            if (parts.length === 3) {
                const [year, month, day] = parts;
                return `${day}/${month}/${year}`;
            }
        }
        
        // Retourne la string originale si le format n'est pas reconnu
        return isoDateString;
    }
}   



export function getTimeElapsed(isoDateString: string) 
{
  const datePassed = new Date(isoDateString);
  const now = new Date();
  const diffMs = now - datePassed; // différence en millisecondes
  
  // Convertir en différentes unités
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  return {
    milliseconds: diffMs,
    seconds: diffSeconds,
    minutes: diffMinutes,
    hours: diffHours,
    days: diffDays
  };
}

export function getTimeElapsedStr(isoDateString: string): string 
{
    const date = new Date(isoDateString);
    const now = new Date();

    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffYears > 0) 
    {
        return `il y a ${diffYears} an${diffYears > 1 ? 's' : ''}`;
    } 
    else if (diffMonths > 0) 
    {
        return `il y a ${diffMonths} mois`;
    } 
    else if (diffDays > 0) 
    {
        return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } 
    else if (diffHours > 0) 
    {
        return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } 
    else if (diffMinutes > 0) 
    {
        return `il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    } 
    else {
        return `il y a quelques secondes`;
    }
}   

/**
 * Converts an ISO 8601 date string to French format with month name (e.g., "20 Mai 2020")
 * Handles various ISO formats including timezone offsets
 * @param isoDateString - Date string in ISO 8601 format (e.g., "2020-05-20T03:53:17.775462+01:00")
 * @returns Date string in French format with month name (e.g., "20 Mai 2020")
 * 
 * @example
 * formatISODateToFrenchWithMonth("2020-05-20T03:53:17.775462+01:00") => "20 Mai 2020"
 * @example
 * formatISODateToFrenchWithMonth("2024-01-05T10:30:00Z") => "05 Janvier 2024"
 * @example
 * formatISODateToFrenchWithMonth("2024-12-25") => "25 Décembre 2024"
 * @example
 * formatISODateToFrenchWithMonth("2023-07-01") => "01 Juillet 2023"
 */
export function formatISODateToFrenchWithMonth(isoDateString: string): string {
    try {
        const date = new Date(isoDateString);
        
        if (isNaN(date.getTime())) {
            throw new Error('Date invalide');
        }
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.getMonth(); // Les mois commencent à 0
        const year = date.getFullYear();
        
        const months = [
            'Janv.', 'Fév.', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'
        ];
        
        const monthName = months[month];
        
        return `${day} ${monthName} ${year}`;
    } catch (error) {
        console.error('Erreur lors du formatage de la date:', error);
        
        // Fallback: yyyy-mm-dd
        if (isoDateString.includes('-')) {
            const parts = isoDateString.split('T')[0].split('-'); 
            if (parts.length === 3) {
                const [year, month, day] = parts;
                const monthIndex = parseInt(month, 10) - 1;
                
                const months = [
                    'Janv.', 'Fév.', 'Mars', 'Avril', 'Mai', 'Juin',
                    'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'
                ];
                
                if (monthIndex >= 0 && monthIndex < 12) {
                    return `${day.padStart(2, '0')} ${months[monthIndex]} ${year}`;
                }
            }
        }
        
        return isoDateString;
    }
}