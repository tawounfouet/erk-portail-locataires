export function getUserRoom(email: string) 
{
    const match = email.match(/^([a-zA-Z]+)-([a-zA-Z0-9]+)@/);
    
    if (match) 
    {
        const apartment = match[2];
        return apartment.toUpperCase();
    }
    
    return "NX";
}

export function formatERKEmailToDisplay(email: string) 
{
    const match = email.match(/^([a-zA-Z]+)-([a-zA-Z0-9]+)@/);
    
    if (match) 
    {
        const building = match[1];
        const apartment = match[2];
        
        const buildingFormatted = building.charAt(0).toUpperCase() + building.slice(1);
        const apartmentFormatted = `Apt ${apartment.toUpperCase()}`;
        
        return `Bâtiment ${buildingFormatted} • ${apartmentFormatted}`;
    }
    
    return email;
}

export function obtainInitial(first_name: string, last_name: string): string
{
    return `${last_name[0]}${first_name[0]}`;
}