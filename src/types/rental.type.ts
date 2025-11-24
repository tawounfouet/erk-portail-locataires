import { IUnit } from "./patrimoine.type";
import { IUser } from "./user.type";

export interface ITenant {
    id: string;
    user: IUser;
    current_unit: IUnit | null;
    current_unit_identifier: string;
    move_in_date: string | null;
    move_out_date: string | null;
    is_currently_renting: boolean;
    days_since_move_in: number | null;
    documents_count: number;
    verified_documents_count: number;
    pending_documents_count: number;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    created_at: string;
}

export interface ITenantListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ITenant[];
}

export interface ITenantFilters {
    page?: number;
    is_currently_renting?: boolean;
    current_unit?: string;
    user?: string;
}

export interface IDocument {
    id: string;
}

export interface ITenantDocument {
    id: string;
    tenant: string;
    document: IDocument | null;
    document_type: string;
    document_type_display: string;
    is_verified: boolean;
    verified_by: string | null;
    verified_by_name: string | null;
    verified_at: string | null;
    expires_at: string | null;
    is_expired: boolean;
    notes: string | null;
    file_url: string | null;
    file_extension: string | null;
    created_at: string;
    updated_at: string;
}

export interface ITenantDocumentListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ITenantDocument[];
}

export interface ITenantDocumentFilters {
    page?: number;
    tenant?: string;
    document_type?: string;
    is_verified?: boolean;
    is_expired?: boolean;
}

export interface ICreateTenantDocumentData {
    tenant: string;
    document_type: string;
    file?: File;
    notes?: string;
    expires_at?: string;
}

export interface IUpdateTenantDocumentData {
    document_type?: string;
    notes?: string;
    expires_at?: string;
    is_verified?: boolean;
}

// ===== PROFIL LOCATAIRE DÉTAILLÉ =====
export interface IManagedUnitList {
  id: string;
  identifier: string;
  // Ajoutez d'autres champs selon vos besoins
}

export interface IRentalUnitInfo {
  // Structure à définir selon la réponse de l'API
  id?: string;
  identifier?: string;
  address?: string;
  // Ajoutez d'autres champs selon vos besoins
}

export interface ITenantDetail {
  id: string;
  user: IUser;
  current_unit: IManagedUnitList | null;
  move_in_date: string | null;
  move_out_date: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  notes: string | null;
  is_currently_renting: boolean;
  rental_unit_identifier: string;
  rental_unit_info: IRentalUnitInfo | null;
  days_since_move_in: number | null;
  lease_duration: string | null;
  has_complete_documentation: boolean;
  documents_count: number;
  verified_documents_count: number;
  pending_documents_count: number;
  expired_documents_count: number;
  tenant_documents: any[]; // À typer plus précisément si nécessaire
  created_at: string;
  updated_at: string;
}

export interface ITenantDetailListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ITenantDetail[];
}