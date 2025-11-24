export function formatERKEmailToDisplay(email: string) {
    const match = email.match(/^([a-zA-Z]+)-([a-zA-Z0-9]+)@/);
    
    if (match) 
    {
        const building = match[1];
        const apartment = match[2];
        
        const buildingFormatted = building.charAt(0).toUpperCase() + building.slice(1);
        const apartmentFormatted = apartment.toUpperCase().startsWith('N') 
        ? `Apt ${apartment.toUpperCase()}` 
        : `Apt ${apartment.toUpperCase()}`;
        
        return `Bâtiment ${buildingFormatted} • ${apartmentFormatted}`;
    }
    
    return email;
}