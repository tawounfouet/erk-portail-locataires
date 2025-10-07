export interface IUser
{
    id: string;
    email: string;

    first_name: string;
    last_name: string;
    phone: string;
    is_active: boolean;
    is_staff: boolean;
    is_tenant: boolean;
    date_joined: string;
    last_login: string;
    full_name: string;
    role_display: string;
}


export interface IAuthContextType 
{
  user: IUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}
