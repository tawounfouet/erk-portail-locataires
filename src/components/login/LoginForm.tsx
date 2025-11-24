import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function LoginForm({ className,...props }: React.ComponentProps<"form">) 
{
    // ==========================================
	// 				   STATE
	// ==========================================
	
    const [userID, setUserID] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // ==========================================
	// 				SERVICE STATE
	// ==========================================
	
    const { user, login } = useAuth();

    // ==========================================
	// 				   FORM HANDLERS
	// ==========================================

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		
		const email = (userID.indexOf('@') === -1) ? `${userID}@eurekanet.com` : userID;

		await login(email, password);
		
		setIsLoading(false);
	};

	// ==========================================
	// 				   RENDER
	// ==========================================

    // If already connected, redirect user to the homepage
    if (user) 
    {
      const from = /*location.state?.from?.pathname ||*/ '/';
      return <Navigate to={from} replace />;
    }

    return (
		<form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold text-white">Connectez-vous à votre espace.</h1>
				<p className="text-gray-300 text-sm text-balance">
				Créer de meilleures relations entre les propriétaires et les locataires !
				</p>
				<h6 className="text-sm text-white">- Eureka</h6>
			</div>
				
			<div className="grid gap-6">
				<div className="grid gap-3">
					<Label htmlFor="userid" className="text-gray-200">Identifiant</Label>
					<Input 
						id="userid" 
						type="userid" 
						placeholder="Entrez votre identifiant..." 
						onChange={(e) => setUserID(e.target.value)}
						required 
						className="w-full h-12 bg-[#333337] border border-white/10 rounded-full p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
					/>
				</div>

				<div className="grid gap-3">
					<Label htmlFor="password" className="text-sm font-medium text-gray-200">
                		Mot de passe
            		</Label>

					<div className="relative">
						<Input
							id="password"
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Entrez votre mot de passe"
							className="w-full h-12 bg-[#333337] border border-white/10 rounded-full p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
						/>
					
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
							aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
						>
							{showPassword ? (<EyeOff className="h-4 w-4" />) : (<Eye className="h-4 w-4" />)}
						</button>
					</div>
				</div>

				<Button type="submit" disabled={isLoading} className="w-full rounded-full shadow-primary/30 shadow-md">
					{isLoading ? 'Connexion...' : 'Se connecter'}
				</Button>
			</div>
			{/* <div className="text-center text-sm">
				Don&apos;t have an account?{" "}
				<a href="#" className="underline underline-offset-4">
				Sign up
				</a>
			</div> */}
		</form>
    )
}

export default LoginForm;