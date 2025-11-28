import AuthService from "@/services/auth";
import { ILoginResponse } from "@/types/auth.type";
import { IAuthContextType, IUser } from "@/types/user.type";
import { createContext, useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<IUser | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');

	const { toast } = useToast();

	// Check authentication
	const checkAuth = useCallback(async () => {
		try {
			setIsLoading(true);
			const { access: accessToken, refresh: refreshToken } = AuthService.getTokens();
			
			if (!accessToken || accessToken == 'no_acess_token') 
			{
				setUser(null);
				return;
			}
			//@TODO: Recheck refreshing logic
			// Server-side checking
			let currentUser = await AuthService.getCurrentUser(accessToken);
			
			if (!currentUser) // Invalid or expired token 
			{
				const bValid = await AuthService.verifyToken(refreshToken);
				
				if (!bValid)
				{
					AuthService.clearTokens();
					setUser(null);
					throw new Error('This user is not authenticated');
				}
				else
				{
					const tokens = await AuthService.refreshToken();

					if (!tokens)
					{
						throw new Error('Failed to authenticate user');
					}

					currentUser = await AuthService.getCurrentUser(tokens.access);
				}
			}
			
			setUser(currentUser);

		} catch (err) {
			setError(err as string);
			AuthService.clearTokens();
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			setIsLoading(true);
			
			const result: ILoginResponse = await AuthService.authenticate(email, password);
			
			if (result.success && result.token && result.user) 
			{
				setUser(result.user);
				return true;
			}
			else if (!result.success && result.response_status)
			{
				console.log(result.response_status)
				
				if (400 <= result.response_status && result.response_status <= 499)
				{
					toast({
						variant: "destructive",
						title: "Hmmm... Tu es sûre de tes identifiants ?",
						description: "Vérifies et ressaisies tes identifiants de connexion pour voir.",
						action: <ToastAction altText="Try again" onClick={() => {login(email, password)}}>Réessayer</ToastAction>,
					});
				}
				else if (500 <= result.response_status && result.response_status <= 599)
				{
					toast({
						variant: "destructive",
						title: "Oups ! Il y a eu un problème.",
						description: "Il y a peut-être un petit soucis avec le serveur...",
						action: <ToastAction altText="Try again" onClick={() => {login(email, password)}}>Réessayer</ToastAction>,
					});
				}
			}

			return false;
		} catch (error) {
		console.error('Login failed:', error);
		return false;
		} finally {
		setIsLoading(false);
		}
	};

	const logout = () => {
		AuthService.destroyToken();
		
		setUser(null);
	};

	const value = {
		user,
		login,
		logout,
		error,
		isLoading,
		isAuthenticated: !!user,
	};

	return (
		<AuthContext.Provider value={value}>
		{children}
		</AuthContext.Provider>
	);
}