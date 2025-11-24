import { useAuth } from "@/hooks/useAuth";
import { ChevronLeft, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function MobileLayout({ children })
{
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isAtHomePage = location.pathname === "/";

    const handleBack = () => {
        const path = location.pathname;
        
        // Compter le nombre de segments dans le chemin
        const segments = path.split('/').filter(segment => segment !== '');
        
        if (segments.length >= 2) 
        {
            const parentPath = '/' + segments.slice(0, -1).join('/');
            navigate(parentPath);
        } 
        else if (segments.length === 1) 
        {
            navigate('/');
        } 
        else 
        {
            navigate(-1);
        }
    }

    if (!user)
    {
        return (
            <div>
                Utilisateur non connecté
            </div>
        );
    }

    return (
        <div className="px-6 relative mx-auto flex h-screen max-w-md flex-col font-display">
            <header className="sticky pt-6 pb-2">
                <div className="flex justify-between items-start">
                    {isAtHomePage ? 
                        (
                            <div>
                                <h2 className="text-3xl font-bold text-white tracking-tight">Bonjour,</h2>
                                <p className="text-muted mt-1 text-lg">Bienvenue chez vous.</p>
                            </div>
                        ) :
                        (
                            <>
                                <div onClick={handleBack} className="bg-transparent p-3 rounded-full border-[0.15em] border-gray-400 active:scale-95 transition-all cursor-pointer group">
                                    <ChevronLeft className="text-primary" />
                                </div>
                            </>
                        )
                    }
                    

                    <div className="w-12 h-12 rounded-full bg-secondary border border-white/10 flex items-center justify-center overflow-hidden">
                        <User className="w-6 h-6 text-gray-400" />
                    </div>
                </div>
            </header>

        
            {children}
        </div>
    );
}