# Eurekanet

## TODO

Some TODOs are marked with the tag `@TODO` in the code in comments. Just search through files. 

**Security**

- [ ] Review Security (data/ folder in public, auth logic, etc.)

**SEO**

- [ ] Review SEO in `index.html`

# How to 

## Run locally

After cloning this repository, run these commands:

```bash
npm install
npm run dev
```

## Add a module (ERKModule)

The application uses a **data-driven architecture** where modules are defined as data objects. Adding a new module is done in 3 steps:

### 1. Create your pages
Create your React components in `src/pages`.

### 2. Define the module
In `src/static/modules.static.tsx`, define a new `IERKModule` object:

```tsx
const MyNewModule: IERKModule = {
    id: 'my-module',
    category_id: 'basic', // for now we just have 'basic' modules but you can add a new category if needed
    title: 'My Module',
    description: 'Description of what this module does',
    color: 'bg-blue-100', // Tailwind class for background color
    icon: 'activity', // Name of the icon (mapped in Icon component)
    
    // Define your routes here. They will be automatically generated.
    routes: [
        {
            path: '/my-path',
            element: <MyPage />,
            children: [] // Nested routes if needed
        }
    ]
};
```

### 3. Register the module
Add your new module object to the `ERKModules` registry in the same file (`src/static/modules.static.tsx`):

```tsx
export const ERKModules: TERKModuleRegistry = new Map([
    [
        'basic', 
        [
            ReportModule,
            DocsModule,
            ContactsModule,
            SuggestionsModule,
            MyNewModule // <--- Add it here
        ]
    ]
]);
```

The application will automatically:
- Generate the React Router routes.
- Add the module to the Sidebar / Dashboard menu.
