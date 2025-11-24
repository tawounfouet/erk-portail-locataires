import { ContactsPage, DetailsReportsPage, DocsPage, HomeReportsPage, NewReportsPage, NewSuggestionPage } from "@/pages";
import HomeSuggestionWithCardPage from "@/pages/suggestions/HomeSuggestionWithCardPage";
import type { TERKModuleRegistry, TERKModuleCategoryRegistry, IERKModule, IERKRoute } from "@/types/module.type";


const ReportModule: IERKModule = {
    id: 'report',
    category_id: 'basic',
    title: 'Signalements',
    description: 'Gérer les signalements',
    color: 'bg-purple-100',
    icon: "reports",

    routes: [
        {
            path: '/reports',
            element: <HomeReportsPage />,
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
    title: "Documents",
    description: "Vos documents",
    color: 'bg-lime-100',
    icon: "documents",

    routes: [
        {
            path: '/docs',
            element: <DocsPage />,
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
    description: "Contacts utiles",
    color: 'bg-amber-100',
    icon: "contacts",

    routes: [
        {
            path: '/contacts',
            element: <ContactsPage />,
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
    description: "Boîte à idées",
    color: 'bg-rose-100',
    icon: 'suggestions',

    routes: [
        {
            path: '/suggestions',
            element: <HomeSuggestionWithCardPage />,
            children: [
                {
                    path: 'new',
                    element: <NewSuggestionPage />
                }
            ]
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
const getAllModules = (): IERKModule[] => {
    return Array.from(ERKModules.values()).flat();
};

/**
 * Helper to retrieve all module routes
 * @returns An array of all routes of each IERKModule
 */
const getAllModuleRoutes = (): IERKRoute[] => {
    return getAllModules().flatMap(module => module.routes);
};

export const ERKModulesArray = getAllModules();

export const ERKModuleRoutesArray = getAllModuleRoutes();