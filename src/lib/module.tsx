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
     * Internal function that traverses the route tree
     * @param routes - Array of routes to transform
     * @returns Array of JSX Route elements
     */
    const renderRoutes = (routes: IERKRoute[]): JSX.Element[] => {
        const routeComponents = [];
        
        for (const route of routes)
        {
            if (route.children && route.children.length > 0)
            {
                routeComponents.push(
                    <Route key={`route-${route.path}`} path={route.path}>
                        <Route index element={route.element} />
                        {route.children.map((child: IERKRoute, index: number) => (
                            <Route key={`route-child-${index}-${child.path}`} path={child.path} element={child.element} />
                        ))}
                    </Route>
                );
            }
            else
            {
                routeComponents.push(
                    <Route
                        key={`route-${route.path}`}
                        path={route.path}
                        element={route.element}
                    />
                );
            }
        }

        return routeComponents;
    }

    return renderRoutes(module.routes);
};
