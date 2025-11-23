/**
 * Represents a route configuration for React Router
 * Defines the path, component element, and optional nested child routes
 */
export interface IERKRoute {
  path: string;
  layout?: JSX.Element;
  element: JSX.Element;
  children?: IERKRoute[];
}

/**
 * Represents a feature module in the application
 * Contains all metadata, routes, and configuration needed to integrate the module
 */
export interface IERKModule {
  id: string;
  category_id: string;
  title: string;
  description: string;
  color: string;
  icon_uri: string;
  
  routes: IERKRoute[]; // Routes du module

  // Optionnel : contexte du module
  context?: React.Context<any>;
  contextProvider?: React.ComponentType<any>;
  
  // Optionnel : données d'initialisation
  initialize?: () => Promise<void>;
}

/**
 * Registry mapping category IDs to their display names
 * Used for organizing modules into logical groups
 */
export type TERKModuleCategoryRegistry = Map<string, string>;

/**
 * Registry organizing modules by their categories
 * Map structure: category_id -> array of modules belonging to that category
 */
export type TERKModuleRegistry = Map<string, IERKModule[]>;