export type TContactType = 
  | 'management' 
  | 'emergency' 
  | 'support'; 
  
export type TContactStatus = 'actif' | 'inactif' | 'en_attente';

export interface IContact
{
  id: number;
  last_name: string;
  first_name: string;
  type: TContactType;
  phone_number: string;
  email?: string;
  private?: boolean;
  address?: string;
  company?: string;
  association?: string;
  administration?: string;
  gestionnaire?: string;
  creation_date?: string;
  status?: TContactStatus;
  position?: string;
  whatsapp?: string;
  is_active?: boolean;
  icon?: string;
}

export interface IContactsData 
{
  contacts: IContact[];
  metadata: {
    version: string;
    lastUpdated: string;
    totalContacts: number;
    types: TContactType[];
  };
}