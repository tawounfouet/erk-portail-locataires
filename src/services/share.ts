import { IReport } from "@/types/reports.type";
import type { TPlatform } from "@/types/share.type";

/**
 * Sharing service for messaging and social networking applications
 * Provides methods for sharing content across different platforms
 */
export default class ShareService
{
    // Basic URLs for different sharing platforms
    private static readonly WHATSAPP_BASE_URL: string = "https://wa.me";
    private static readonly WHATSAPP_API_URL: string = "https://api.whatsapp.com/send";
    private static readonly TELEGRAM_BASE_URL: string = "https://t.me/share/url";
    private static readonly EMAIL_BASE_URL: string = "mailto:";

    /**
     * Shares a message via WhatsApp to a specific number or allows the user to choose the recipient
     * @param message - Message to send (default: report template)
     * @param dest_number - Recipient's number in international format (without ‘+’ or spaces)
     * 
     * @example
     * // Share to a specific number
     * ShareService.shareToWhatsApp(“Hello!”, “237690191404”);
     * 
     * @example
     * // Share with default message (report)
     * ShareService.shareToWhatsapp();
     * 
     * @example
     * // Custom share without specific recipient
     * ShareService.shareToWhatsapp(“Custom message”);
     */
    static shareToWhatsapp(message: string = this.getDefaultReportMessage(), dest_number: string | null = null): void
    {
        try {
            const encodedMessage = encodeURIComponent(message);
            let shareUrl: string;

            if (dest_number) // Check the number format 
            {
                const cleanedNumber = this.cleanPhoneNumber(dest_number);

                if (!this.isValidInternationalNumber(cleanedNumber)) 
                {
                    console.warn(`Numéro WhatsApp invalide: ${dest_number}`);
                    return;
                }
                
                shareUrl = `${this.WHATSAPP_BASE_URL}/${cleanedNumber}?text=${encodedMessage}`;
            } 
            else 
            {
                // Standard sharing (user chooses contact/group)
                shareUrl = `${this.WHATSAPP_API_URL}?text=${encodedMessage}`;
            }

            this.openShareWindow(shareUrl, 'whatsapp-share');
            
        } catch (error) {
            console.error('Erreur lors du partage WhatsApp:', error);
        }
    }

    /**
     * Shares a report via multiple channels using a standardized format.
     * @param reportData - Report data to be shared.
     * @param platform - Sharing platform (‘whatsapp’, ‘telegram’, ‘email’).
     * @param contact - Specific contact (number or email).
     * 
     * @example
     * ShareService.shareReport(
     *   {
     *     space: “ERK-H5”,
     *     category: “plumbing,”
     *     title: “Water leak,”
     *     description: “Leak under the kitchen sink”
     *   },
     *   ‘WhatsApp’,
     *   ‘237690191404’
     * );
     */
    static shareReport(reportData: IReport, platform: TPlatform = 'whatsapp', contact: string | null = null): void 
    {
        const message = this.formatReportMessage(reportData);
        
        switch (platform) {
            case 'whatsapp':
                this.shareToWhatsapp(message, contact);
                break;
            
                case 'telegram':
                //this.shareToTelegram(message);
                break;

            case 'email':
                // this.shareByEmail(
                //     contact || '',
                //     `Signalement - ${reportData.title}`,
                //     message
                // );
                break;

            default:
                console.warn(`Plateforme de partage non supportée: ${platform}`);
        }
    }

    /**
     * Generic sharing with automatic platform detection
     * @param message - Message to share
     * @param platforms - Platforms to use (default: WhatsApp, Telegram, email)
     */
    static async shareGeneric(message: string,  platforms: Array<TPlatform> = ['whatsapp', 'telegram', 'email']): Promise<void> {
        if (platforms.includes('whatsapp'))
        {
            this.shareToWhatsapp(message);
            return;
        }
        
        if (platforms.includes('telegram')) 
        {
            //this.shareToTelegram(message);
            return;
        }
        
        if (platforms.includes('email')) {
            //this.shareByEmail('', '', message);
            return;
        }
        
        // Fallback
        await this.copyToClipboard(message);
    }

    /**
     * Generates a formatted report message.
     * @param reportData - Report data.
     * @returns string - Formatted message.
     */
    private static formatReportMessage(reportData: IReport): string 
    {
        const urgencyEmoji = reportData.priority === 'high' ? '🔴' : 
                           reportData.priority === 'medium' ? '🟡' : '🔵';
        
        return `
🚨 **NOUVEAU SIGNALEMENT** 🚨
${urgencyEmoji} Espace privé : ${reportData.id}
📋 Catégorie: ${reportData.category}

📝 Titre: ${reportData.title}
📄 Description: ${reportData.description}

🕒 Date: ${new Date().toLocaleDateString('fr-FR')}
        `.trim();
    }

    /**
     * Returns the default alert message
     * @returns string - Formatted default message
     */
    private static getDefaultReportMessage(): string {
        return this.formatReportMessage({
            id: 0,
            category: "plomberie",
            title: "Fuite d'eau",
            description: "Fuite d'eau sous l'évier de la cuisine.",
            status: "",
            date: new Date(),
            priority: "medium",
            last_update: new Date()
        });
    }

    /**
     * Cleans and formats a phone number
     * @param phoneNumber - Phone number to be cleaned
     * @returns string - Cleaned number
     */
    private static cleanPhoneNumber(phoneNumber: string): string {
        return phoneNumber.replace(/\s+/g, '').replace(/^\+/, '');
    }

    /**
     * Validates a phone number in international format
     * @param phoneNumber - Number to validate
     * @returns boolean - True if the number is valid
     */
    private static isValidInternationalNumber(phoneNumber: string): boolean {
        // Basic validation of international numbers
        const internationalRegex = /^\d{8,15}$/;
        return internationalRegex.test(phoneNumber);
    }

    /**
     * Opens a sharing window
     * @param url - Sharing URL
     * @param featureName - Name of the feature for tracking
     */
    private static openShareWindow(url: string, featureName: string): void {
        const windowFeatures = 'width=600,height=700,resizable=yes,scrollbars=yes';
        
        window.open(url, '_blank', windowFeatures);
        
        // Optional: Tracking analytics
        console.log(`Share action: ${featureName}`);
    }

    /**
     * Copy text to clipboard
     * @param text - Text to copy
     * @returns Promise<boolean> - True if copying was successful
     */
    static async copyToClipboard(text: string): Promise<boolean> {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                console.log('Texte copié dans le presse-papier');
                return true;
            } else {
                // Fallback pour les anciens navigateurs
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                console.log('Texte copié dans le presse-papier (fallback)');
                return true;
            }
        } catch (error) {
            console.error('Erreur lors de la copie dans le presse-papier:', error);
            return false;
        }
    }
}