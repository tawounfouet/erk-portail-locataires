import { LucideIcon } from 'lucide-react';

// Types pour les valeurs enumérées
export type TReportCategory = 
  | 'plomberie' 
  | 'electricite' 
  | 'porte' 
  | 'chauffage' 
  | 'internet' 
  | 'autre';

export type TReportPriority = 'low' | 'medium' | 'high';

export type TReportStatus = 'recu' | 'prise_en_charge' | 'confirme' | 'annule' | 'en_cours' | 'traite' | 'cloture';

// Types pour les objets de configuration
export interface ICategory 
{
  value: TReportCategory;
  label: string;
}

export interface IPriority 
{
  value: TReportPriority;
  label: string;
  color: string; // Tailwind CSS class
}

export interface IStatus 
{
  value: TReportStatus;
  label: string;
  color: string;    // Tailwind CSS class
  icon: LucideIcon; // Lucide react icon ref
}

// Type principal pour une demande
export interface IMaintenanceRequest 
{
  id: number;
  category: TReportCategory;
  title: string;
  description: string;
  status: TReportStatus;
  date: string;         // Date string format in ymd
  priority: TReportPriority;
  last_update: string;   // Date string format in ymd
}

// Version avec dates en objet Date
export interface IReport
{
  id: number;
  category: string;
  title: string;
  description: string;
  status: string;
  date: Date;
  priority: TReportPriority;
  last_update: Date;
}

export interface IReportsData
{
  reports: IReport[];
  metadata: {
    version: string;
    last_update: string;
    total_data_count: number;
    type: string; 
  }
}