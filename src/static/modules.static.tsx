import { ContactsWithCardsPage, DetailsReportsPage, DocsWithCardsPage, HomeReportsWithCardsPage, NewReportsPage, NewSuggestionPage } from "@/pages";
import type { TERKModuleRegistry, TERKModuleCategoryRegistry, IERKModule, IERKRoute } from "@/types/module.type";


const ReportModule: IERKModule = {
    id: 'report',
    category_id: 'basic',
    title: 'Signalements',
    description: 'Signaler les problèmes dans votre logement',
    color: 'bg-purple-100',
    icon_uri: '/icons/report.svg',

    routes: [
        {
            path: '/reports',
            element: <HomeReportsWithCardsPage />,
            children: [
                {
                    path: ':id',
                    element: <DetailsReportsPage />
                },
                {
                    path: 'new',
                    element: <NewReportsPage />
                },
                {
                    path: ':id/edit',
                    element: <></>
                },
            ]
        }
    ],

    // Optionnal
    // context: ReportContext,
    // contextProvider: ReportProvider
};

const DocsModule: IERKModule = {
    id: "docs",
    category_id: 'basic',
    title: "Mes Documents",
    description: "Accéder à vos documents importants",
    color: 'bg-lime-100',
    icon_uri: '/',

    routes: [
        {
            path: '/docs',
            element: <DocsWithCardsPage />,
            children: []
        }
    ],

    // Optionnal
    // context: DocsContext,
    // contextProvider: DocsProvider

};

const ContactsModule: IERKModule = {
    id: "contacts",
    category_id: 'basic',
    title: "Carnet d'adresse",
    description: "Trouver rapidement les numéros d'urgence et importants",
    color: 'bg-amber-100',
    icon_uri: '/',

    routes: [
        {
            path: '/contacts',
            element: <ContactsWithCardsPage />,
            children: []
        }
    ],

    // Optionnal
    // context: ContactsContext,
    // contextProvider: ContactsProvider

};

const SuggestionsModule: IERKModule = {
    id: "suggestions",
    category_id: 'basic',
    title: "Suggestions",
    description: "Partagez vos idées pour améliorer la résidence",
    color: 'bg-rose-100',
    icon_uri: '/',

    routes: [
        {
            path: '/suggestions',
            element: <NewSuggestionPage />,
            children: []
        }
    ],

    // Optionnal
    // context: SuggestionsContext,
    // contextProvider: SuggestionsProvider
}

export const ERKModuleCategories: TERKModuleCategoryRegistry = new Map([
    ['basic', 'Modules de base'],
    ['advanced', 'Modules avancés']
]);

export const ERKModules: TERKModuleRegistry = new Map([
    [
        'basic', 
        [
            ReportModule,
            DocsModule,
            ContactsModule,
            SuggestionsModule
        ]
    ]
]);

/**
 * Helper to retrieve all modules
 * @returns An array of all IERKModules
 */
export const getAllModules = (): IERKModule[] => {
    return Array.from(ERKModules.values()).flat();
};

/**
 * Helper to retrieve all module routes
 * @returns An array of all routes of each IERKModule
 */
export const getAllModuleRoutes = (): IERKRoute[] => {
    return getAllModules().flatMap(module => module.routes);
};