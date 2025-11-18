import { Route } from "react-router-dom";
import { IERKModule, IERKRoute } from "@/types/module.type";


/**
 * Recursively generates React Router Route elements from a module.
 * This function transforms a module's route configuration into React Router components.
 * 
 * @param module - The module containing the route configuration.
 * @returns An array of JSX Route elements ready to be rendered in React Router.
 */
export const generateRoutesFromModule = (module: IERKModule): JSX.Element[] => {

    /**
     * Internal recursive function that traverses the route tree
     * @param routes - Array of routes to transform
     * @returns Array of JSX Route elements
     */
    const renderRoutesRecursive = (routes: IERKRoute[]): JSX.Element[] => {
        return routes.flatMap((route, index) => {
    
            const key = `${module.id}-${route.path}-${index}`;
            
            if (route.children && route.children.length > 0) 
            {
                return [
                    <Route 
                        key={key} 
                        path={route.path} 
                        element={route.element}
                    >
                        {renderRoutesRecursive(route.children)}
                    </Route>
                ];
            }
            
            return [
                <Route 
                    key={key} 
                    path={route.path} 
                    element={route.element} 
                />
            ];
        });
    };

    return renderRoutesRecursive(module.routes);
};