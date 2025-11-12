// hooks/usePageInfo.ts
import { useLocation, useParams } from 'react-router-dom';
import { data } from '@/static/navigation.static'; // Adjust the import path as needed
import { useEffect } from 'react';

interface PageInfo {
  path: string;
  name: string;
  icon?: React.ComponentType<any>;
  id?: string;
  isHome: boolean;
  breadcrumb: Array<{ title: string; url: string }>;
  section: 'main' | 'clouds' | 'secondary' | 'documents' | 'unknown';
}

export function usePageInfo(): PageInfo {
  const location = useLocation();
  const params = useParams();
  
  const path = location.pathname;

  /**
   * Trouve les informations de la page dans la structure de navigation
   */
  const findPageInNavigation = () => {
    // Vérifier dans navMain
    const mainPage = data.navMain.find(item => item.url === path);
    if (mainPage) {
      return {
        title: mainPage.title,
        icon: mainPage.icon,
        section: 'main' as const
      };
    }

    // Vérifier dans navClouds (et ses sous-items)
    for (const cloud of data.navClouds) {
      if (cloud.url === path) {
        return {
          title: cloud.title,
          icon: cloud.icon,
          section: 'clouds' as const
        };
      }
      // Vérifier les sous-items des clouds
      const cloudSubItem = cloud.items?.find(item => item.url === path);
      if (cloudSubItem) {
        return {
          title: cloudSubItem.title,
          icon: cloud.icon,
          section: 'clouds' as const
        };
      }
    }

    // Vérifier dans navSecondary
    const secondaryPage = data.navSecondary.find(item => item.url === path);
    if (secondaryPage) {
      return {
        title: secondaryPage.title,
        icon: secondaryPage.icon,
        section: 'secondary' as const
      };
    }

    // Vérifier dans documents
    const documentPage = data.documents.find(item => item.url === path);
    if (documentPage) {
      return {
        title: documentPage.name,
        icon: documentPage.icon,
        section: 'documents' as const
      };
    }

    // Page non trouvée dans la navigation
    return null;
  };

  /**
   * Génère le nom de la page pour les routes dynamiques
   */
  const getDynamicPageName = (): { title: string; section: string } => {
    const segments = path.split('/').filter(Boolean);
    
    // Route avec ID (ex: /reports/123)
    if (segments.length === 2 && params.id) {
      const parentPage = data.navMain.find(item => 
        item.url === `/${segments[0]}`
      );
      
      if (parentPage) {
        return {
          title: `Détails ${parentPage.title.toLowerCase()}`,
          section: 'main'
        };
      }
    }

    // Route de création (ex: /reports/new)
    if (path.endsWith('/new')) {
      const parentSegment = path.replace('/new', '');
      const parentPage = data.navMain.find(item => item.url === parentSegment);
      
      if (parentPage) {
        return {
          title: `Nouveau ${parentPage.title.toLowerCase()}`,
          section: 'main'
        };
      }
    }

    // Page d'accueil
    if (path === '/') {
      return {
        title: 'Tableau de bord',
        section: 'main'
      };
    }

    // Fallback : utiliser le dernier segment du chemin
    const lastSegment = segments[segments.length - 1];
    return {
      title: lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1),
      section: 'unknown'
    };
  };

  /**
   * Génère le fil d'Ariane
   */
  const getBreadcrumb = () => {
    const breadcrumb: Array<{ title: string; url: string }> = [];
    
    // Toujours commencer par l'accueil
    breadcrumb.push({ title: 'Accueil', url: '/' });

    const segments = path.split('/').filter(Boolean);
    
    let currentPath = '';
    for (const segment of segments) {
      currentPath += `/${segment}`;
      
      // Essayer de trouver le titre dans la navigation
      let title = segment;
      
      // Chercher dans navMain
      const mainItem = data.navMain.find(item => item.url === currentPath);
      if (mainItem) {
        title = mainItem.title;
      }
      // Chercher dans les autres sections
      else {
        const allItems = [
          ...data.navMain,
          ...data.navClouds,
          ...data.navSecondary,
          ...data.documents
        ];
        const foundItem = allItems.find(item => item.url === currentPath);
        if (foundItem) {
          title = 'title' in foundItem ? foundItem.title : foundItem.name;
        }
        // Pour les routes avec ID, utiliser un titre générique
        else if (segment === params.id) {
          title = 'Détails';
        }
        // Pour les routes "new"
        else if (segment === 'new') {
          title = 'Nouveau';
        }
        else {
          // Capitaliser le segment
          title = segment.charAt(0).toUpperCase() + segment.slice(1);
        }
      }
      
      breadcrumb.push({ title, url: currentPath });
    }

    return breadcrumb;
  };

  // Trouver les informations de la page
  const pageInNav = findPageInNavigation();
  const dynamicInfo = getDynamicPageName();
  
  const pageInfo = pageInNav || {
    title: dynamicInfo.title,
    icon: undefined,
    section: dynamicInfo.section
  };

  const breadcrumb = getBreadcrumb();

  return {
    path,
    name: pageInfo.title,
    icon: pageInfo.icon,
    id: params.id,
    isHome: path === '/',
    breadcrumb,
    section: pageInfo.section
  };
}

// Hook utilitaire pour le titre du document
export function useDocumentTitle() {
  const { name } = usePageInfo();
  
  useEffect(() => {
    const appName = 'EurekaNet';
    document.title = name === 'Tableau de bord' 
      ? appName 
      : `${name} - ${appName}`;
      
    return () => {
      document.title = appName;
    };
  }, [name]);
}