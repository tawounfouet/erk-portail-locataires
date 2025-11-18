import { getAllModules } from '@/static/modules.static';
import { useEffect } from 'react';

export const useModulesInitialization = () => {
    useEffect(() => {
        const initializeModules = async () => {
            const modules = getAllModules();
            
            for (const module of modules) {
                if (module.initialize) {
                    try {
                        await module.initialize();
                    } catch (error) {
                        console.error(`Failed to initialize module ${module.id}:`, error);
                    }
                }
            }
        };

        initializeModules();
    }, []);
};