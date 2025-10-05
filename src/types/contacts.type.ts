export type TContactType = 
  | 'Particulier' 
  | 'Entreprise' 
  | 'Association' 
  | 'Administration'
  | 'Gestionnaire';

export type TContactStatus = 'actif' | 'inactif' | 'en_attente';

export interface IContact
{
  id: number;
  last_name: string;
  first_name: string;
  type: TContactType;
  email: string;
  phone_number: string;
  private?: boolean;
  address?: string;
  company?: string;
  association?: string;
  administration?: string;
  gestionnaire?: string;
  creation_date?: string;
  status?: TContactStatus;
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