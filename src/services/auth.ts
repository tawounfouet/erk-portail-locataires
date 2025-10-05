import { IUser } from "@/types/user.type";
import usersData from '@/data/users-v001.json';


interface ILoginResponse {
  success: boolean;
  token?: string;
  user?: IUser;
  expiresIn?: number;
  message?: string;
}


const simulateNetworkDelay = (): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

// Generate a simulated JWT token (do not use in production)
const generateMockToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }));
  return `${header}.${payload}.mockSignature`;
};

const auth_testmode = async (email: string, password: string): Promise<ILoginResponse | null> => {
    await simulateNetworkDelay();
    
    const user = usersData.users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
    );

    if (!user) {
        return {
            success: false,
            message: "Email ou mot de passe incorrect"
        };
    }

    // Don't return the password
    const { password: _, ...userWithoutPassword } = user;
    
    return {
        success: true,
        token: generateMockToken(user.id),
        user: userWithoutPassword,
        expiresIn: 86400 // 24 hours in seconds
    };
}

const auth_realmode = async (email: string, password: string) : Promise<ILoginResponse | null> => {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return null;
    } catch (error) {
        console.error('Authentication failed:', error);
        return null;
    }
}



// Secure storage with expiration management
export const authService = {
    setToken: (token: string, expiresIn: number = 3600) => {
        const expiresAt = Date.now() + (expiresIn * 1000);

        localStorage.setItem('authToken', token);
        localStorage.setItem('authTokenExpiry', expiresAt.toString());
    },
    
    getToken: (): string | null => {
        const token = localStorage.getItem('authToken');
        const expiry = localStorage.getItem('authTokenExpiry');
        
        if (!token || !expiry) return null;
        
        // Check if the token is expired (24h limits)
        if (Date.now() > parseInt(expiry)) {

            localStorage.removeItem('authToken');
            localStorage.removeItem('authTokenExpiry');
            return null;
        }
        
        return token;
    },
    
    clearToken: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authTokenExpiry');
    },
    
    // Server-side checking
    verifyToken: async (token: string): Promise<IUser | null> => {
        try {
        const response = await fetch('/api/auth/verify', {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        });
        
        if (response.ok) {
            return await response.json();
        }
        return null;
        } catch (error) {
            console.error('Token verification failed:', error);
        return null;
        }
    },
  
    // Authentication 
    authenticate: auth_testmode
};
