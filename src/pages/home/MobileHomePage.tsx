import { useAuth } from "@/hooks/useAuth";
import { getIconComponent } from "@/services/icons";
import { Plus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";


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
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </a>
      </div>
    </div>
  );
};


const NavGroup = ({ items }) => {
	const location = useLocation();
	
	return (
		<div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 pb-6">
		{items.map((item) => {
			const navigationState = {
				previousPage : location.pathname,
				pageTitle: item.pageTitle 
			};


			const Icon = getIconComponent(item.icon)
	
			return (
				<Link to={item.link} state={navigationState} className="flex flex-1 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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


const FloatingActionButton = ({text, onClick }) => {
  return (
    <div className="fixed bottom-24 right-4 z-10 mx-auto max-w-md sm:right-[calc(50%-11rem)]">
      <button 
        className="flex h-14 min-w-0 cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full bg-primary px-5 pl-4 pr-6 text-base font-bold leading-normal tracking-[0.015em] text-white shadow-lg"
        onClick={onClick}
      >
        <span className="material-symbols-outlined"><Plus /></span>
        <span className="truncate">{text}</span>
      </button>
    </div>
  );
};


const MobileHomePage = () => {
    const { user } = useAuth();
	const navigate = useNavigate();

	const actionPanelData = {
		title: "Report #1234 is under review",
		description: "We will notify you of any updates.",
		linkText: "View Details",
		linkUrl: "#"
	};

	const navItems = [
		{
			icon: "Reports",
			title: "Signaler un incident",
			pageTitle: 'Signalements',
			description: "Submit a new safety or maintenance report",
			link: '/reports'
		},
		{
			icon: "Documents",
			title: "Mes Documents",
			pageTitle: 'Documents',
			description: "Accéder à vos documents importants",
			link: '/docs'
		},
		{
			icon: "Contacts",
			title: "Carnet d'adresse",
			pageTitle: 'Carnet',
			description: "Trouver rapidement les numéros d'urgence et importants",
			link: '/contacts'
		},
		{
			icon: "Suggestions",
			title: "Suggestions pour la résidence",
			pageTitle: 'Suggestions',
			description: "Partagez vos idées pour améliorer la résidence",
			link: '/suggestions'
		}
	];

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
                    You are connected as {user.full_name}
                </h2>

                <ActionPanel {...actionPanelData} />
				<NavGroup items={navItems} />
				<NavGroup items={navItems} />
				<NavGroup items={navItems} />
				<NavGroup items={navItems} />
				<NavGroup items={navItems} />
            </main>

            <FloatingActionButton 
                text="Signalement"
                onClick={() => navigate('/reports/new')}
            />            
        </>
    );
};

export default MobileHomePage;