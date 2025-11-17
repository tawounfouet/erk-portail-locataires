import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Asterisk, Building, Headphones, Phone, Shield, User, Wifi, Wrench } from "lucide-react";
import { useState } from "react";

// Contact Card Component
const ContactCard = ({ contact }) => {
  const IconComponent = contact.icon;
  
  return (
    <Card className="border-slate-200 hover:bg-slate-750 transition-colors">
      <div className="p-4 flex items-center gap-4">
        <div className={`${contact.iconBg} rounded-xl p-3`}>
          <IconComponent className={`w-6 h-6 ${contact.iconColor}`} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{contact.title}</h3>
          <p className="text-sm text-slate-400">{contact.subtitle}</p>
        </div>

        <Button
          size="icon"
          className="bg-primary hover:bg-blue-700 rounded-full w-12 h-12 flex-shrink-0"
          onClick={() => window.open(`tel:${contact.phone}`, '_self')}
        >
          <Phone className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};

// Contact Section Component
const ContactSection = ({ title, contacts }) => {
  if (contacts.length === 0) return null;
  
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="space-y-3">
        {contacts.map(contact => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>
    </div>
  );
};

// Main Component
export default function UrgentContacts() {
  const [searchTerm, setSearchTerm] = useState('');

  const allContacts = [
    {
      id: 1,
      title: 'Campus Security',
      subtitle: '24/7 Availability',
      phone: '+1234567890',
      icon: Shield,
      iconBg: 'bg-red-900/30',
      iconColor: 'text-red-500',
      category: 'emergency'
    },
    {
      id: 2,
      title: 'Fire/Medical Emergency',
      subtitle: 'Call 911',
      phone: '911',
      icon: Asterisk,
      iconBg: 'bg-red-900/30',
      iconColor: 'text-red-500',
      category: 'emergency'
    },
    {
      id: 3,
      title: 'Residence Manager',
      subtitle: 'Mon-Fri, 9am-5pm',
      phone: '+1234567891',
      icon: Building,
      iconBg: 'bg-blue-900/30',
      iconColor: 'text-blue-500',
      category: 'residence'
    },
    {
      id: 4,
      title: 'Urgent Maintenance',
      subtitle: 'Leaks, Power Outages',
      phone: '+1234567892',
      icon: Wrench,
      iconBg: 'bg-blue-900/30',
      iconColor: 'text-blue-500',
      category: 'residence'
    },
    {
      id: 5,
      title: 'IT & Wi-Fi Support',
      subtitle: '24/7 Helpline',
      phone: '+1234567893',
      icon: Wifi,
      iconBg: 'bg-blue-900/30',
      iconColor: 'text-blue-500',
      category: 'residence'
    },
    {
      id: 6,
      title: 'Mental Health Services',
      subtitle: 'Confidential Support',
      phone: '+1234567894',
      icon: User,
      iconBg: 'bg-blue-900/30',
      iconColor: 'text-blue-500',
      category: 'student'
    },
    {
      id: 7,
      title: 'Resident Advisor on Duty',
      subtitle: 'After-hours support',
      phone: '+1234567895',
      icon: Headphones,
      iconBg: 'bg-blue-900/30',
      iconColor: 'text-blue-500',
      category: 'student'
    }
  ];

  // Filter contacts based on search
  const filteredContacts = allContacts.filter(contact => 
    contact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group contacts by category
  const emergencyContacts = filteredContacts.filter(c => c.category === 'emergency');
  const residenceContacts = filteredContacts.filter(c => c.category === 'residence');
  const studentContacts = filteredContacts.filter(c => c.category === 'student');

  return (
    <>
      <div className="space-y-6">
        <ContactSection 
          title="Numéros d'urgence" 
          contacts={emergencyContacts}
        />
        <ContactSection 
          title="Gestion de la Résidence" 
          contacts={residenceContacts}
        />
      <ContactSection 
        title="Equipe support du site" 
        contacts={studentContacts}
      />
      <ContactSection 
        title="Equipe support du site" 
        contacts={studentContacts}
      />
      <ContactSection 
        title="Equipe support du site" 
        contacts={studentContacts}
      />
      <ContactSection 
        title="Equipe support du site" 
        contacts={studentContacts}
      />
      <ContactSection 
        title="Equipe support du site" 
        contacts={studentContacts}
      />
      <ContactSection 
        title="Equipe support du site" 
        contacts={studentContacts}
      />
      <ContactSection 
        title="Equipe support du site" 
        contacts={studentContacts}
      />
      <ContactSection 
        title="Equipe support du site" 
        contacts={studentContacts}
      />
      </div>

      {filteredContacts.length === 0 && (
        <div className="px-4 py-12 text-center">
          <p className="text-slate-400">No contacts found</p>
        </div>
      )}
    </>
  );
}