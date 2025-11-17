import { useState, useEffect } from 'react';
import type { IContact } from '@/types/contacts.type';
import ContactService from '@/services/contacts';

export function useContacts() {
    const [contacts, setContacts] = useState<IContact[]>([]);
    const [emergencyContacts, setEmergencyContacts] = useState<IContact[]>([]);
    const [managementContacts, setManagementContacts] = useState<IContact[]>([]);
    const [supportContacts, setSupportContacts] = useState<IContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadContacts = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await ContactService.getContacts();

            setContacts(data.contacts);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    const loadEmergencyContacts = async () =>  {
        try {
            setLoading(true);
            setError(null);

            const data = await ContactService.getEmergencyContacts();

            setEmergencyContacts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    const loadManagementContacts = async () =>  {
        try {
            setLoading(true);
            setError(null);

            const data = await ContactService.getManagementContacts();

            setManagementContacts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    const loadSupportContacts = async () =>  {
        try {
            setLoading(true);
            setError(null);

            const data = await ContactService.getSupportContacts();

            setSupportContacts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadContacts();       
        loadEmergencyContacts(); 
        loadManagementContacts(); 
        loadSupportContacts(); 
    }, []);


    return {
        contacts,
        loading,
        error,
        emergencyContacts,
        managementContacts,
        supportContacts,
    };
}