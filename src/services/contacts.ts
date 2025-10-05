import { IContactsData } from "@/types/contacts.type";

export const getContactsAsync = async (): Promise<IContactsData> => {
  try {
    const response = await fetch('/data/contacts-v001.json');

    if (!response.ok) 
    {
      throw new Error('Failed to load contact data.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error: ', error);

    return { 
        contacts: [], 
        metadata: {
            version: "0.0",
            lastUpdated: "",
            totalContacts: 0,
            types: []
        }
    };
  }
};
