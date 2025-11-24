import { useAuth } from "@/hooks/useAuth";
import { getIconComponent } from "@/lib/icons";
import { ERKModulesArray } from "@/static/modules.static";
import { IERKModule } from "@/types/module.type";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";


const ActionPanel = ({ title, description, linkText, linkUrl }) => {
  return (
    <div className="py-8 @container">
      <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 @[480px]:flex-row @[480px]:items-center">
        <div className="flex flex-col gap-1">
          <p className="font-bold leading-tight text-slate-800 dark:text-white">{title}</p>
          <p className="text-base font-normal leading-normal text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
        <a 
          className="flex shrink-0 items-center gap-2 text-sm font-bold leading-normal tracking-[0.015em] text-primary" 
          href={linkUrl}
        >
          {linkText}
          <ArrowRight />
        </a>
      </div>
    </div>
  );
};


const NavGroup = ({ items }: { items: IERKModule[] }) => {
	const location = useLocation();
	
	return (
		<div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 pb-6">
		{items.map((item: IERKModule, index: number) => {
			const navigationState = {
				previousPage : location.pathname,
				pageTitle: item.title 
			};

			const Icon = getIconComponent(item.icon_uri);
	
			return (
				<Link key={`${index}${item.id}${index}`} to={item.routes[0].path} state={navigationState} className="flex flex-1 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
					<span className="text-primary"><Icon /></span>
					<div className="flex flex-col gap-1">
						<h2 className="font-bold leading-tight text-slate-800 dark:text-white">{item.title}</h2>
						<p className="text-sm font-normal leading-normal text-slate-500 dark:text-slate-400">
						{item.description}
						</p>
					</div>
				</Link>
			);
			}
		)}
	</div>
  );
};

export default function MobileHomePage() 
{
    const { user } = useAuth();
	
	const actionPanelData = {
		title: "Quoi de neuf dans votre résidence ?",
		description: "Pour le moment aucune nouvelle à signaler !",
		linkText: "Voir plus",
		linkUrl: "#"
	};

    if (!user)
    {
        return (
            <div>
                Utilisateur non connecté
            </div>
        );
    }

    return (
        <>    
			<main className="flex-1 overflow-y-auto">
				<h2 className="text-[28px] font-bold leading-tight tracking-tight text-slate-800 dark:text-white">
                    Accueil
                </h2>

                <ActionPanel {...actionPanelData} />
				        <NavGroup items={ERKModulesArray} />
            </main>          
        </>
    );
};
