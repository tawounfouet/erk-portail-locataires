import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { ArrowLeft, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "../ui/separator";

export default function MobileLayout({ children })
{
    const { user } = useAuth();
    const location = useLocation();


    const isAtHomePage = location.pathname === "/";

    let previousPage = null;
    let pageTitle = null;

    if (location.state)
    {
        previousPage = location.state.previousPage;
        pageTitle = location.state.pageTitle;
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
        <div className="px-6 relative mx-auto flex h-screen max-w-md flex-col bg-background-light dark:bg-background-dark font-display">
            <header className="sticky pt-6 flex shrink-0 flex-col gap-2 bg-background-light pb-2 dark:bg-background-dark">
                <div className="flex h-12 items-center justify-between">
                    <div className="flex size-12 shrink-0 items-center">
                        {isAtHomePage && (<Avatar className="h-8 w-8 rounded-lg grayscale">
                            <AvatarFallback className="rounded-lg">{user.last_name.charAt(0)}{user.first_name.charAt(0)}</AvatarFallback>
                        </Avatar>)}
                        
                        {previousPage && (
                            <Link to={previousPage}>
                                <ArrowLeft />
                            </Link>
                        )}
                    </div>
                    
                    <div>
                        <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-800 dark:text-white">{pageTitle}</h1>
                    </div>

                    <div className="flex w-12 items-center justify-end">
                        <button className="flex h-12 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-transparent p-0 text-base font-bold leading-normal tracking-[0.015em] text-slate-800 dark:text-white min-w-0">
                            <Bell />
                        </button>
                    </div>
                </div>

                {!isAtHomePage && <Separator className="mb-6" />}
            </header>

        
            {children}
        </div>
    );
}