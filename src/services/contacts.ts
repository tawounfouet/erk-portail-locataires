import { IContact, IContactsData, TContactType } from "@/types/contacts.type";
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


/**
 * Service for managing contact data operations
 * Provides methods to retrieve, filter, and manage contact information
 * Supports different contact types: gestion, emergency, support
 */
export default class ContactService
{  
	/**
	 * Retrieves all contacts from the data source
	 * @returns Promise<IContactsData> - Complete contacts data with metadata
	 * @throws Error when data loading fails
	 */
	static async getContacts(): Promise<IContactsData>
	{
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
	}

	/**
	 * Retrieves contacts filtered by specific type
	 * @param type - The contact type to filter by
	 * @returns Promise<IContact[]> - Array of contacts matching the specified type
	 */
	static async getContactsByType(type: TContactType): Promise<IContact[]> {
		try {
			const data = await this.getContacts();
			
			// Filter contacts by the specified type
			const filteredContacts = data.contacts.filter(contact => 
				contact.type === type  /* && contact.is_active */
			);
		
		return filteredContacts;
		
		} catch (error) {
			// console.error(`❌ Error loading contacts for type ${type}:`, error);
			return [];
		}
	}

	/**
	 * Retrieves emergency contacts (high priority contacts)
	 * @returns Promise<IContact[]> - Array of emergency contacts sorted by priority
	 */
	static async getEmergencyContacts(): Promise<IContact[]> {
		try {
			const contacts = await this.getContactsByType('emergency');
			return contacts;
		
		} catch (error) {
			console.error('❌ Error loading emergency contacts:', error);
			return [];
		}
	}

	/**
	 * Retrieves management contacts
	 * @returns Promise<IContact[]> - Array of management contacts
	 */
	static async getManagementContacts(): Promise<IContact[]> {
		try {
			return await this.getContactsByType('management');
		} catch (error) {
			console.error('❌ Error loading management contacts:', error);
			return [];
		}
	}

	/**
	 * Retrieves support contacts
	 * @returns Promise<IContact[]> - Array of support contacts
	 */
	static async getSupportContacts(): Promise<IContact[]> {
		try {
			return await this.getContactsByType('support');
		} catch (error) {
			console.error('❌ Error loading support contacts:', error);
			return [];
		}
	}

	/**
	 * Retrieves contacts by multiple types
	 * @param types - Array of contact types to filter by
	 * @returns Promise<IContact[]> - Array of contacts matching any of the specified types
	 */
	static async getContactsByTypes(types: TContactType[]): Promise<IContact[]> {
		try {
			const data = await this.getContacts();
			
			// Filter contacts by multiple types
			const filteredContacts = data.contacts.filter(contact => 
				types.includes(contact.type) && contact.is_active
			);
			
			console.log(`✅ Found ${filteredContacts.length} contacts for types: ${types.join(', ')}`);
			return filteredContacts;
		
		} catch (error) {
			console.error(`❌ Error loading contacts for types ${types.join(', ')}:`, error);
			return [];
		}
	}
}
