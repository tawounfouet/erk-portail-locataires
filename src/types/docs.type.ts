// Types pour les valeurs enumérées
export type TDocumentType = 
  | 'contrat' 
  | 'facture' 
  | 'etat_lieux' 
  | 'quittance' 
  | 'assurance' 
  | 'autre';

export type TFileType = 
  | 'pdf' 
  | 'image' 
  | 'word' 
  | 'excel' 
  | 'text';

// Type principal pour un document
export interface IDocument {
  id: number;
  type: DocumentType;
  name: string;
  date: string;     // ou Date si vous convertissez
  size: string;
  url: string;      // data URL ou chemin vers le fichier
  filetype: TFileType;
}

// Version avec dates en objet Date
export interface IDocumentWithDates 
{
  id: number;
  type: DocumentType;
  name: string;
  date: Date;
  size: string;
  url: string;
  fileType: TFileType;
}

// Pour les formulaires d'upload
export interface IUploadDocumentForm {
  type: TDocumentType;
  name: string;
  file: File;
  date: string;
}

// Pour les filtres
export interface IDocumentFilters {
  type?: TDocumentType;
  fileType?: TFileType;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

// Pour les statistiques
export interface IDocumentStats {
  total: number;
  byType: Record<TDocumentType, number>;
  byFileType: Record<TFileType, number>;
  totalSize: string;
}

// Pour le prévisualisation
export interface IDocumentPreview {
  id: number;
  name: string;
  url: string;
  fileType: TFileType;
  isImage: boolean;
  isPdf: boolean;
}