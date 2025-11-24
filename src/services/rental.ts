import AuthService from './auth';
import { 
  ITenantListResponse, 
  ITenant, 
  ITenantFilters,
  ITenantDocumentListResponse,
  ITenantDocument,
  ITenantDocumentFilters,
  ICreateTenantDocumentData,
  IUpdateTenantDocumentData,
  ITenantDetailListResponse
} from '@/types/rental.type';
import { ERK_API_URL } from '@/static/dev.static';

/**
 * Service pour la gestion des locations, locataires et documents
 */
export default class RentalService 
{
    // Base URLs pour les endpoints de l'API rental
    private static readonly BASE_URL: string = ERK_API_URL;
    private static readonly TENANTS_URL: string = "/rental/tenants/";
    private static readonly TENANT_DOCUMENTS_URL: string = "/rental/tenant-documents/";
    private static readonly TENANTS_MY_PROFILE_URL: string = "/rental/tenants/my_profile/";


    /**
     * Méthode générique pour les appels API avec gestion d'erreurs
     * @param endpoint - Endpoint API à appeler
     * @param options - Options fetch (method, headers, body, etc.)
     * @returns Promise<T> - Données de réponse
     * @throws Error si la requête échoue
     */
    private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T>
    {
        const url = `${this.BASE_URL}${endpoint}`;
        
        // Récupérer le token d'authentification
        const tokens = AuthService.getTokens();
        const accessToken = tokens.access !== 'no_access_token' ? tokens.access : null;

        // Préparer la configuration de la requête
        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) 
            {
                let errorMessage = `Erreur HTTP! status: ${response.status}`;
                let errorDetails = null;
                
                try {
                    errorDetails = await response.json();
                    console.error('❌ Détails de l\'erreur API:', errorDetails);
                    
                    // Formater les erreurs de validation pour une meilleure lisibilité
                    if (response.status === 400 && errorDetails) {
                        const validationErrors = Object.entries(errorDetails)
                            .map(([field, messages]) => {
                                const msgArray = Array.isArray(messages) ? messages : [messages];
                                return `  • ${field}: ${msgArray.join(', ')}`;
                            })
                            .join('\n');
                        errorMessage = `Erreur de validation:\n${validationErrors}`;
                    }
                } catch {
                    // Si le corps de la réponse n'est pas du JSON, utiliser le texte du statut
                    errorMessage = `Erreur HTTP! status: ${response.status} - ${response.statusText}`;
                }
                
                // Gérer l'expiration du token
                if (response.status === 401 && accessToken) {
                    try {
                        // Essayer de rafraîchir le token
                        const newTokens = await AuthService.refreshToken();
                        config.headers = {
                            ...config.headers,
                            'Authorization': `Bearer ${newTokens.access}`
                        };
                        
                        // Réessayer la requête avec le nouveau token
                        const retryResponse = await fetch(url, config);
                        if (!retryResponse.ok) {
                            throw new Error(`Erreur HTTP! status: ${retryResponse.status}`);
                        }
                        return await retryResponse.json();
                    } catch (error) {
                        AuthService.clearTokens();
                        console.error('Erreur: ', error);
                        throw new Error('Session expirée, veuillez vous reconnecter');
                    }
                }
                
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            console.error('Échec de la requête API:', error);
            throw error;
        }
    }

    /**
     * Méthode pour les requêtes avec form-data (upload de fichiers)
     */
    private static async requestWithFormData<T>(endpoint: string, formData: FormData, method: string = 'POST'): Promise<T>
    {
        const url = `${this.BASE_URL}${endpoint}`;
        
        const tokens = AuthService.getTokens();
        const accessToken = tokens.access !== 'no_access_token' ? tokens.access : null;

        const config: RequestInit = {
            method,
            headers: {
                ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
            },
            body: formData,
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                let errorMessage = `Erreur HTTP! status: ${response.status}`;
                try {
                    const errorDetails = await response.json();
                    console.error('❌ Détails de l\'erreur API:', errorDetails);
                    
                    if (response.status === 400 && errorDetails) {
                        const validationErrors = Object.entries(errorDetails)
                            .map(([field, messages]) => {
                                const msgArray = Array.isArray(messages) ? messages : [messages];
                                return `  • ${field}: ${msgArray.join(', ')}`;
                            })
                            .join('\n');
                        errorMessage = `Erreur de validation:\n${validationErrors}`;
                    }
                } catch {
                    errorMessage = `Erreur HTTP! status: ${response.status} - ${response.statusText}`;
                }
                
                if (response.status === 401 && accessToken) {
                    try {
                        const newTokens = await AuthService.refreshToken();
                        config.headers = {
                            ...config.headers,
                            'Authorization': `Bearer ${newTokens.access}`
                        };
                        
                        const retryResponse = await fetch(url, config);
                        if (!retryResponse.ok) {
                            throw new Error(`Erreur HTTP! status: ${retryResponse.status}`);
                        }
                        return await retryResponse.json();
                    } catch (error) {
                        AuthService.clearTokens();
                        throw new Error('Session expirée, veuillez vous reconnecter');
                    }
                }
                
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            console.error('Échec de la requête API avec form-data:', error);
            throw error;
        }
    }

    // ===== GESTION DES LOCATAIRES =====

    /**
     * Récupère la liste des locataires avec pagination et filtres
     * @param filters - Critères de filtrage pour les locataires
     * @returns Promise<ITenantListResponse> - Réponse paginée des locataires
     */
    static async getTenants(filters: ITenantFilters = {}): Promise<ITenantListResponse>
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        const queryString = params.toString();
        const url = queryString ? `${this.TENANTS_URL}?${queryString}` : this.TENANTS_URL;

        return this.request<ITenantListResponse>(url);
    }

    /**
     * Récupère un locataire spécifique par son ID
     * @param id - UUID du locataire
     * @returns Promise<ITenant> - Détails du locataire
     */
    static async getTenantById(id: string): Promise<ITenant>
    {
        return this.request<ITenant>(`${this.TENANTS_URL}${id}/`);
    }

    /**
     * Récupère les locataires actuellement en location
     * @param filters - Filtres supplémentaires
     * @returns Promise<ITenantListResponse> - Liste des locataires actifs
     */
    static async getCurrentTenants(filters: Omit<ITenantFilters, 'is_currently_renting'> = {}): Promise<ITenantListResponse>
    {
        return this.getTenants({
            ...filters,
            is_currently_renting: true
        });
    }

    /**
     * Récupère les locataires par unité
     * @param unitId - ID de l'unité
     * @param filters - Filtres supplémentaires
     * @returns Promise<ITenantListResponse> - Liste des locataires de l'unité
     */
    static async getTenantsByUnit(unitId: string, filters: Omit<ITenantFilters, 'current_unit'> = {}): Promise<ITenantListResponse>
    {
        return this.getTenants({
            ...filters,
            current_unit: unitId
        });
    }

    // ===== GESTION DES DOCUMENTS LOCATAIRES =====

    /**
     * Récupère la liste des documents locataires avec pagination et filtres
     * @param filters - Critères de filtrage pour les documents
     * @returns Promise<ITenantDocumentListResponse> - Réponse paginée des documents
     */
    static async getTenantDocuments(filters: ITenantDocumentFilters = {}): Promise<ITenantDocumentListResponse>
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        const queryString = params.toString();
        const url = queryString ? `${this.TENANT_DOCUMENTS_URL}?${queryString}` : this.TENANT_DOCUMENTS_URL;

        return this.request<ITenantDocumentListResponse>(url);
    }

    /**
     * Récupère un document locataire spécifique par son ID
     * @param id - UUID du document
     * @returns Promise<ITenantDocument> - Détails du document
     */
    static async getTenantDocumentById(id: string): Promise<ITenantDocument>
    {
        return this.request<ITenantDocument>(`${this.TENANT_DOCUMENTS_URL}${id}/`);
    }

    /**
     * Crée un nouveau document locataire
     * @param data - Données du document à créer
     * @returns Promise<ITenantDocument> - Document créé
     */
    static async createTenantDocument(data: ICreateTenantDocumentData): Promise<ITenantDocument>
    {
        if (data.file) {
            // Utiliser FormData pour l'upload de fichier
            const formData = new FormData();
            formData.append('tenant', data.tenant);
            formData.append('document_type', data.document_type);
            formData.append('file', data.file);
            
            if (data.notes) {
                formData.append('notes', data.notes);
            }
            if (data.expires_at) {
                formData.append('expires_at', data.expires_at);
            }

            return this.requestWithFormData<ITenantDocument>(this.TENANT_DOCUMENTS_URL, formData);
        } else {
            // Requête standard sans fichier
            return this.request<ITenantDocument>(this.TENANT_DOCUMENTS_URL, {
                method: 'POST',
                body: JSON.stringify(data),
            });
        }
    }

    /**
     * Met à jour un document locataire existant
     * @param id - UUID du document à mettre à jour
     * @param data - Données mises à jour du document
     * @returns Promise<ITenantDocument> - Document mis à jour
     */
    static async updateTenantDocument(id: string, data: IUpdateTenantDocumentData): Promise<ITenantDocument>
    {
        return this.request<ITenantDocument>(`${this.TENANT_DOCUMENTS_URL}${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    /**
     * Supprime un document locataire
     * @param id - UUID du document à supprimer
     * @returns Promise<void>
     */
    static async deleteTenantDocument(id: string): Promise<void>
    {
        return this.request(`${this.TENANT_DOCUMENTS_URL}${id}/`, {
            method: 'DELETE',
        });
    }

    /**
     * Récupère les documents d'un locataire spécifique
     * @param tenantId - UUID du locataire
     * @param filters - Filtres supplémentaires
     * @returns Promise<ITenantDocumentListResponse> - Liste des documents du locataire
     */
    static async getDocumentsByTenant(tenantId: string, filters: Omit<ITenantDocumentFilters, 'tenant'> = {}): Promise<ITenantDocumentListResponse>
    {
        return this.getTenantDocuments({
            ...filters,
            tenant: tenantId
        });
    }

    /**
     * Récupère les documents par type
     * @param documentType - Type de document
     * @param filters - Filtres supplémentaires
     * @returns Promise<ITenantDocumentListResponse> - Liste des documents filtrés
     */
    static async getDocumentsByType(documentType: string, filters: Omit<ITenantDocumentFilters, 'document_type'> = {}): Promise<ITenantDocumentListResponse>
    {
        return this.getTenantDocuments({
            ...filters,
            document_type: documentType
        });
    }

    /**
     * Récupère les documents vérifiés
     * @param filters - Filtres supplémentaires
     * @returns Promise<ITenantDocumentListResponse> - Liste des documents vérifiés
     */
    static async getVerifiedDocuments(filters: Omit<ITenantDocumentFilters, 'is_verified'> = {}): Promise<ITenantDocumentListResponse>
    {
        return this.getTenantDocuments({
            ...filters,
            is_verified: true
        });
    }

    /**
     * Récupère les documents en attente de vérification
     * @param filters - Filtres supplémentaires
     * @returns Promise<ITenantDocumentListResponse> - Liste des documents en attente
     */
    static async getPendingDocuments(filters: Omit<ITenantDocumentFilters, 'is_verified'> = {}): Promise<ITenantDocumentListResponse>
    {
        return this.getTenantDocuments({
            ...filters,
            is_verified: false
        });
    }


    /**
     * Récupère le profil locataire de l'utilisateur connecté
     * @param page - Numéro de page pour la pagination
     * @returns Promise<TenantDetailListResponse> - Profil détaillé du locataire
     */
    static async getMyTenantProfile(page?: number): Promise<ITenantDetailListResponse>
    {
        const params = new URLSearchParams();
        if (page !== undefined && page !== null) {
            params.append('page', page.toString());
        }

        const queryString = params.toString();
        const url = queryString ? `${this.TENANTS_MY_PROFILE_URL}?${queryString}` : this.TENANTS_MY_PROFILE_URL;

        return this.request<ITenantDetailListResponse>(url);
    }
}