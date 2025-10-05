import { useState, useEffect } from 'react';
import type { IContact, TContactType } from '@/types/contacts.type';
import { getContactsAsync } from '@/services/contacts';

export function useContacts() {
    const [contacts, setContacts] = useState<IContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadContacts = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getContactsAsync();

                setContacts(data.contacts);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }

        loadContacts();        
    }, []);

    const addContact = (contact: Omit<IContact, 'id'>) => {
    const newContact: IContact = {
        ...contact,
        id: Math.max(...contacts.map(c => c.id)) + 1
    };
        setContacts(prev => [...prev, newContact]);
    };

    const updateContact = (id: number, updates: Partial<IContact>) => {
        setContacts(prev => 
                prev.map(contact => 
                contact.id === id ? { ...contact, ...updates } : contact
            )
        );
    };

    const deleteContact = (id: number) => {
        setContacts(prev => prev.filter(contact => contact.id !== id));
    };

    const getContactById = (id: number): IContact | undefined => {
        return contacts.find(contact => contact.id === id);
    };

    const filterByType = (type: TContactType): IContact[] => {
        return contacts.filter(contact => contact.type === type);
    };

    return {
        contacts,
        loading,
        error,
        addContact,
        updateContact,
        deleteContact,
        getContactById,
        filterByType
    };
}