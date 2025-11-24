import Redirector from "@/components/common/Redirector";
import { useAuth } from "@/hooks/useAuth";
import { getIconComponent } from "@/lib/icons";
import { formatERKEmailToDisplay } from "@/lib/user";
import { ERKModulesArray as AppModules } from "@/static/modules.static";
import { CheckCircle2, Clock, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage()
{ 
	const { user } = useAuth();

	if (!user) 
		return <Redirector />

    return (
	<div className="space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
		{/* Quick Status / Notification Card */}
		<div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 rounded-3xl p-6 relative overflow-hidden group cursor-pointer hover:border-primary/40 transition-colors">
			<div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl -mr-8 -mt-8" />
			
			<div className="relative z-10">
			<div className="flex items-center gap-3 mb-3">
				<div className="p-2 bg-primary text-black rounded-full">
					<Clock className="w-4 h-4" />
				</div>
				<span className="text-primary font-semibold text-sm tracking-wide uppercase">Notification</span>
			</div>

			<h3 className="text-xl font-bold text-white mb-1">Rien pour le moment</h3>
			<p className="text-gray-400 text-sm mb-4">Retrouvez les actions à mener et les actualités de la résidence sur EurekaNet.</p>
			
			{/* <div className="flex items-center text-sm font-medium text-white group-hover:underline decoration-primary decoration-2 underline-offset-4">
				Consulter les documents <CheckCircle2 className="w-4 h-4 ml-2" />
			</div> */}
			</div>
		</div>

		{/* Grid Menu */}
		<div>
			<h3 className="text-lg font-semibold text-white mb-4 ml-1">Accès Rapide</h3>
			<div className="grid grid-cols-2 gap-4">
			{
				AppModules.map((module) => {
					const Icon = getIconComponent(module.icon);
					return (
						<Link
							key={`${module.id}`}
							to={module.routes[0].path}
							className="bg-[#2f2014] border border-white/5 p-5 rounded-3xl flex flex-col items-center text-center gap-3 hover:bg-white/5 active:scale-95 transition-all cursor-pointer group"
						>
							<div className="w-14 h-14 rounded-full bg-[#403222] flex items-center justify-center group-hover:text-primary transition-colors">
								<Icon className="w-7 h-7 text-primary" />
							</div>
							<div>
							<span className="block text-white font-semibold">{module.title}</span>
							<span className="text-xs text-gray-400">{module.description}</span>
							</div>
						</Link>
					)
				})
			}
			</div>
		</div>

		{/* Bottom Info */}
		<div className="bg-secondary/30 rounded-2xl p-4 flex items-center justify-between border border-white/5">
			<div className="flex items-center gap-3">
				<div className="p-3 bg-gray-800 rounded-full">
					<Home className="w-4 h-4 text-white" />
				</div>

				<div>
					<p className="text-sm font-medium text-white">Résidence Eureka</p>
					<p className="text-xs text-gray-400">{formatERKEmailToDisplay(user.email)}</p>
				</div>
			</div>
		</div>
	</div>
    );
}