export interface IUser
{
    id: string;
    email: string;
    name: string;
}

export interface IAuthContextType 
{
  user: IUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}
