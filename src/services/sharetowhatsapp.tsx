/**
 * 
 * @param message message to send to whatsapp 
 * @param dest_number the receiver number. In an international format style.
 * 
 * @example
 * shareToWhatsapp("Hello Eureka!", "237690191404")
 * shareToWhatsapp("Hello Eureka!") - To let the user choose the receiver
 */
export function shareToWhatsapp(message: string = `
        🚨 **NOUVEAU SIGNALEMENT** 🚨
        Espace privé : ERK-H5
        Catégorie: plomberie

        Titre: Fuite d'eau.
        Description: Fuite d'eau sous l'évier de la cuisine.
    `, dest_number: string | null = null)
{
    const msg = encodeURIComponent(message);
    
    // Si numéro de groupe spécifique
    if (dest_number) {
      window.open(`https://wa.me/${dest_number}?text=${msg}`, '_blank');
    } else {
      // Standard sharing (user chooses contact/group)
      window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
    }
}
