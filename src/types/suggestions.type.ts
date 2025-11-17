// ===== TYPES AND ENUMS =====

/**
 * Suggestion status types
 */
export type TSuggestionStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'in_progress' 
  | 'implemented' 
  | 'rejected';

/**
 * Suggestion category types
 */
export type TSuggestionCategory =
  | 'common_spaces'
  | 'services_equipment'
  | 'activities_events'
  | 'security_comfort'
  | 'communication'
  | 'environment_sustainability'
  | 'other';

// ===== COMMENT INTERFACES =====

/**
 * Suggestion comment interface
 */
export interface ISuggestionComment {
  id: string; // UUID
  suggestion: string; // UUID - Suggestion concernée
  author?: string; // UUID - Auteur du commentaire (readOnly)
  author_name: string; // Nom de l'auteur (readOnly)
  comment: string; // Contenu du commentaire
  is_internal: boolean; // Commentaire interne (visible uniquement par l'équipe)
  created_at: string; // Date et heure de création (readOnly)
}

/**
 * Filters for suggestion comments
 */
export interface ISuggestionCommentFilters {
  suggestion?: string; // Filter by suggestion UUID
  author?: string; // Filter by author UUID
  is_internal?: boolean; // Filter by internal comments
  ordering?: string; // Ordering field
  page?: number; // Page number for pagination
}

// ===== RESPONSE INTERFACES =====

/**
 * Suggestion response interface
 */
export interface ISuggestionResponse {
  id: string; // UUID (readOnly)
  suggestion: string; // UUID - Suggestion concernée
  response_text: string; // Texte de la réponse
  is_official: boolean; // Réponse officielle
  responder?: string; // UUID - Répondeur (readOnly)
  responder_name: string; // Nom du répondeur (readOnly)
  email_sent: boolean; // Email envoyé (readOnly)
  email_sent_at?: string; // Email envoyé le (readOnly, nullable)
  created_at: string; // Date et heure de création (readOnly)
}

/**
 * Filters for suggestion responses
 */
export interface ISuggestionResponseFilters {
  suggestion?: string; // Filter by suggestion UUID
  responder?: string; // Filter by responder UUID
  is_official?: boolean; // Filter by official responses
  email_sent?: boolean; // Filter by email sent status
  ordering?: string; // Ordering field
  page?: number; // Page number for pagination
}

// ===== SUGGESTION INTERFACES =====

/**
 * Suggestion list item (simplified for listing)
 */
export interface ISuggestionList {
  id: string; // UUID
  titre: string; // Titre court de la suggestion
  categorie: TSuggestionCategory; // Catégorie de la suggestion
  status: TSuggestionStatus; // Statut de traitement
  anonyme: boolean; // Suggestion anonyme
  author_display: string; // Nom d'affichage de l'auteur
  assigned_to?: string; // UUID - Assigné à
  assigned_to_name: string; // Nom de la personne assignée
  response_count: number; // Nombre de réponses
  comment_count: number; // Nombre de commentaires
  created_at: string; // Date et heure de création
  reviewed_at?: string; // Date d'examen (nullable)
  implemented_at?: string; // Date de mise en œuvre (nullable)
}

/**
 * Suggestion creation interface
 */
export interface ISuggestionCreate {
  titre: string; // Titre court de la suggestion (1-200 chars)
  description: string; // Description détaillée de la suggestion
  categorie: TSuggestionCategory; // Catégorie de la suggestion
  anonyme: boolean; // Si coché, la suggestion est anonyme
  nom?: string; // Nom complet du suggérant (max 200 chars)
  email?: string; // Courriel pour le suivi (max 254 chars)
  telephone?: string; // Numéro de téléphone (optionnel, max 17 chars)
  rappel: boolean; // Souhaite être contacté pour discuter de la suggestion
}

/**
 * Suggestion detail interface (complete with relationships)
 */
export interface ISuggestionDetail {
  id: string; // UUID (readOnly)
  titre: string; // Titre court de la suggestion (1-200 chars)
  description: string; // Description détaillée de la suggestion
  categorie: TSuggestionCategory; // Catégorie de la suggestion
  anonyme: boolean; // Suggestion anonyme
  nom?: string; // Nom complet du suggérant (max 200 chars)
  email?: string; // Courriel pour le suivi (max 254 chars)
  telephone?: string; // Numéro de téléphone (optionnel, max 17 chars)
  rappel: boolean; // Souhaite être contacté pour discuter de la suggestion
  author?: string; // UUID - Utilisateur connecté (si applicable) (readOnly, nullable)
  author_display: string; // Nom d'affichage de l'auteur (readOnly)
  contact_email: string; // Email de contact (readOnly)
  status: TSuggestionStatus; // Statut de traitement de la suggestion
  assigned_to?: string; // UUID - Responsable du traitement (nullable)
  assigned_to_name: string; // Nom de la personne assignée (readOnly)
  reviewed_at?: string; // Date à laquelle la suggestion a été examinée (readOnly, nullable)
  implemented_at?: string; // Date de mise en œuvre de la suggestion (readOnly, nullable)
  responses: ISuggestionResponse[]; // Liste des réponses (readOnly)
  comments: ISuggestionComment[]; // Liste des commentaires (readOnly)
  attachments: ISuggestionAttachment[]; // Liste des pièces jointes (readOnly)
  created_at: string; // Date et heure de création (readOnly)
  updated_at: string; // Date et heure de dernière modification (readOnly)
  is_active: boolean; // Indique si l'enregistrement est actif
}

/**
 * Suggestion attachment interface
 */
export interface ISuggestionAttachment {
  id: string; // UUID
  title: string; // Titre de la pièce jointe
  description?: string; // Description de la pièce jointe
  file: string; // Fichier (URL ou chemin)
  file_url: string; // URL du fichier (readOnly)
  file_type: string; // Type de fichier
  created_at: string; // Date et heure de création
}

/**
 * Filters for suggestions
 */
export interface ISuggestionFilters {
  status?: TSuggestionStatus; // Filter by status
  categorie?: TSuggestionCategory; // Filter by category
  anonyme?: boolean; // Filter by anonymous suggestions
  author?: string; // Filter by author UUID
  assigned_to?: string; // Filter by assigned user UUID
  is_active?: boolean; // Filter by active status
  search?: string; // Search term
  ordering?: string; // Ordering field
  page?: number; // Page number for pagination
}

// ===== RESPONSE TYPES FOR PAGINATION =====

/**
 * Paginated response for comments
 */
export interface ISuggestionCommentPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ISuggestionComment[];
}

/**
 * Paginated response for responses
 */
export interface ISuggestionResponsePaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ISuggestionResponse[];
}

/**
 * Paginated response for suggestions list
 */
export interface ISuggestionListPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ISuggestionList[];
}

/**
 * Paginated response for suggestions detail
 */
export interface ISuggestionDetailPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ISuggestionDetail[];
}

// ===== FORM DATA TYPES =====

/**
 * Data for creating a comment
 */
export interface ISuggestionCommentCreateData {
  suggestion: string; // UUID - Suggestion concernée
  comment: string; // Contenu du commentaire (minLength: 1)
  is_internal?: boolean; // Commentaire interne
}

/**
 * Data for creating a response
 */
export interface ISuggestionResponseCreateData {
  suggestion: string; // UUID - Suggestion concernée
  response_text: string; // Texte de la réponse (minLength: 1)
  is_official?: boolean; // Réponse officielle
}

/**
 * Data for assigning a suggestion
 */
export interface ISuggestionAssignData {
  assigned_to: string; // UUID - User to assign to
}

/**
 * Data for changing suggestion status
 */
export interface ISuggestionStatusChangeData {
  status: TSuggestionStatus; // New status
}