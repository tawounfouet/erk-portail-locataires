import { CopyButtonWithToast } from "@/components/common/CopyButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useContacts } from "@/hooks/useContacts";
import { getIconComponent, WhatsappIcon } from "@/services/icons";
import ShareService from "@/services/share";
import { IContact } from "@/types/contacts.type";
import { Phone } from "lucide-react";
import { useState } from "react";

// Contact Card Component
const ContactCard = ({ contact, color }: { contact: IContact, color: string }) => {
  const IconComponent = getIconComponent(contact.icon || "");
  
  return (
    <Card className="border-slate-200 hover:bg-slate-750 transition-colors">
      <div className="p-4 flex items-center gap-4">
        <div className={`bg-${color}-900/30 rounded-xl p-3`}>
          <IconComponent className={`w-6 h-6 text-${color}-500`} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{contact.position}</h3>
          {/* <p className="text-sm text-slate-400">{contact.subtitle}</p> */}
        </div>

        <CopyButtonWithToast
          size="icon"
          successMessage="Numéro copié"
          text={contact.phone_number}
          className="bg-primary hover:bg-primary-300 rounded-full w-12 h-12 flex-shrink-0"
        />
        <Button
          size="icon"
          className="bg-primary hover:bg-primary-300 rounded-full w-12 h-12 flex-shrink-0"
          onClick={() => window.open(`tel:${contact.phone_number}`, '_self')}
        >
          <Phone className="w-5 h-5" />
        </Button>
        {contact.whatsapp && (
          <Button
            size="icon"
            className="bg-primary hover:bg-primary-300 rounded-full w-12 h-12 flex-shrink-0"
            onClick={() => ShareService.shareToWhatsapp('Test de contact', contact.whatsapp)}
          >
            <WhatsappIcon className="w-5 h-5" />
          </Button>
        )}

      </div>
    </Card>
  );
};

interface IContactSectionProps
{
  title: string;
  contacts: IContact[];
  color: string;
}

// Contact Section Component
const ContactSection = ({ title, contacts, color }: IContactSectionProps) => {
  if (contacts.length === 0) return null;
  
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="space-y-3">
        {contacts.map(contact => (
          <ContactCard key={contact.id} contact={contact} color={color} />
        ))}
      </div>
    </div>
  );
};

// Main Component
export default function UrgentContacts() {
  const [searchTerm, setSearchTerm] = useState('');
  

  // Filter contacts based on search
  // const filteredContacts = allContacts.filter(contact => 
  //   contact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   contact.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // Group contacts by category
  const { emergencyContacts, managementContacts, supportContacts } =  useContacts();

  return (
    <>
      <div className="space-y-6">
        <ContactSection 
          color="red"
          title="Numéros d'urgence" 
          contacts={emergencyContacts}
        />
        <ContactSection 
          color="green"
          title="Gestion de la Résidence" 
          contacts={managementContacts}
        />
        <ContactSection 
          color="blue"
          title="Equipe support du site" 
          contacts={supportContacts}
        />
      </div>
{/* 
      {filteredContacts.length === 0 && (
        <div className="px-4 py-12 text-center">
          <p className="text-slate-400">No contacts found</p>
        </div>
      )} */}
    </>
  );
}