import { IContactsData } from "@/types/contacts.type";
import contactData from "@/data/contacts-v001.json"

export const getContactsAsync = async (): Promise<IContactsData> => {
  try {
    // const response = await fetch('/data/contacts-v001.json');

    // if (!response.ok) 
    // {
    //   throw new Error('Failed to load contact data.');
    // }
    
    // return await response.json();

    return {
      contacts: contactData.contacts,
      metadata: {
            version: "0.0",
            lastUpdated: "",
            totalContacts: 0,
            types: []
        }
    };
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
