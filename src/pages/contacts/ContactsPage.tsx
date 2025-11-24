import { CopyButtonWithToast } from "@/components/common/CopyButton";
import { Button } from "@/components/ui/button";
import { useContacts } from "@/hooks/useContacts";
import { WhatsappIcon } from "@/lib/icons";
import ShareService from "@/services/share";
import { IContact } from "@/types/contacts.type";
import { Phone, User } from "lucide-react";

function ContactCardSection({ category, contacts, bUrgent = false }: { category: string, contacts: IContact[], bUrgent?: boolean })
{
    return (
        <div className="pt-4">
            <h1 className="text-lg uppercase text-primary font-bold">{category}</h1>

            {contacts.map((contact: IContact) => (
            <div 
                key={contact.id}
                className={`relative overflow-hidden rounded-3xl p-5 border transition-all mt-4 
                    ${bUrgent 
                    ? 'bg-red-500/10 border-red-500/20' 
                    : 'bg-[#8a6c4a] border-white/5'}`
                }
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-white">{contact.first_name || contact.position}</h3>
                        <span className={`
                            text-sm
                            ${bUrgent 
                                ? 'text-red-400' 
                                : 'text-white/60'
                            }
                            `}
                        >
                            {contact.position}
                        </span>
                    </div>

                    <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${bUrgent 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-primary/20 text-primary'}
                        
                    `}>
                        <User className="w-5 h-5" />
                    </div>
                </div>

                <div className="text-2xl font-mono text-white/90 mb-6 tracking-wide">
                    {contact.phone_number}
                </div>

                <div className="flex gap-4">
                        <CopyButtonWithToast
                            size="icon"
                            successMessage="Numéro copié"
                            text={contact.phone_number}
                            className="bg-[#d6a773] hover:bg-gray-300 rounded-xl w-12 h-12"
                        />
                        <Button
                            size="icon"
                            className="bg-[#d6a773] hover:bg-gray-300 rounded-xl w-12 h-12"
                            onClick={() => window.open(`tel:${contact.phone_number}`, '_self')}
                        >
                            <Phone className="w-5 h-5" />
                        </Button>

                        {contact.whatsapp && (
                            <Button
                                size="icon"
                                className="bg-[#d6a773] hover:bg-gray-300 rounded-xl w-12 h-12"
                                onClick={() => ShareService.shareToWhatsapp('Bonjour', contact.whatsapp)}
                            >
                                <WhatsappIcon className="w-5 h-5" />
                            </Button>
                        )}
                </div>
            </div>
            ))}
        </div>
    )
}

export default function ContactsPage()
{
    const { emergencyContacts, managementContacts } =  useContacts();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            <div className="mb-6 mt-2">
                <h2 className="text-3xl font-bold text-white tracking-tight">Carnet</h2>
                <p className="text-gray-400 mt-1">Numéros utiles de la résidence</p>
            </div>

            <ContactCardSection category="Gestion de la résidence" contacts={managementContacts} />
            <ContactCardSection category="Urgence" contacts={emergencyContacts} bUrgent />
        </div>
    );
}