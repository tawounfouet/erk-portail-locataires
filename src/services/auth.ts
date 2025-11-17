import { IUser } from "@/types/user.type";
import { DEFAULT_USER } from "@/static/users.static";
import { IAuthTokens, ILoginResponse } from "@/types/auth.type";

// Local Storage variable names
const LS_ACCESS_TOKEN =  'access_token';
const LS_REFRESH_TOKEN = 'refresh_token';

/**
 * Authentication service for managing JWT authentication
 * Provides methods for logging in, verifying, and refreshing tokens
 */
export default class AuthService
{
    // Basic URLs for the authentication API
    private static readonly BASE_URL: string = "https://app.eureka-residences.com/api/auth";
    private static readonly AUTHENTICATION_URL: string = "/jwt/create/";
    private static readonly LOGOUT_URL: string = "/jwt/logout/";
    private static readonly REFRESH_TOKEN_URL: string = "/jwt/refresh/";
    private static readonly VERIFY_TOKEN_URL: string = "/jwt/verify/";
    private static readonly CURRENT_USER_URL: string = "/users/me/";

    private static currentUser: IUser | null = null; 

    /**
     * Authenticates a user with email and password
     * @param email - User's email
     * @param password - User's password
     * @returns Promise<ILoginResponse | null> - Connection response or null if unsuccessful
     */
    static async authenticate(email: string, password: string): Promise<ILoginResponse> 
    {
        try {
            const response = await fetch(`${this.BASE_URL}${this.AUTHENTICATION_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password })
            });

            if (!response.ok) 
            {
                // Authentication failed with status: ${response.status}
                return { success: false, response_status: response.status };
            }

            
            const tokens: IAuthTokens = await response.json();
            this.setTokens(tokens);
                
            // Retrieve information about the logged-in user
            AuthService.currentUser = await this.getCurrentUser(tokens.access) || DEFAULT_USER;

            return {
                success: true, 
                token: tokens.access,
                user: AuthService.currentUser,
                expiresIn: 86400, // 24 hours in seconds
            };
        } catch (error) {
            console.error('Authentication failed:', error);
            return {
                success: false,
            };
        }
    }

    /**
     * Retrieves information about the currently logged-in user.
     * @param accessToken - JWT token for authentication.
     * @returns Promise<IUser | null> - User information or null in case of error.
     */
    static async getCurrentUser(accessToken?: string): Promise<IUser | null> 
    {
        const token = accessToken || this.getTokens().access;
        
        if (!token) 
        {
            console.warn('No access token available');
            return null;
        }

        if (AuthService.currentUser)
        {
            return AuthService.currentUser;
        }

        const response = await fetch(`${this.BASE_URL}${this.CURRENT_USER_URL}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) 
        {
            console.warn(`Failed to get current user: ${response.status}`);
            return null; // Error retrieving user data
        }

        return response.json();
    }


    /**
     * Checks the validity of a JWT token
     * @param accessToken - JWT token to be checked
     * @returns Promise<boolean> - True if the token is valid
     */
    static async verifyToken(accessToken: string): Promise<boolean> 
    {
        try {
            const response = await fetch(`${this.BASE_URL}${this.VERIFY_TOKEN_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: accessToken })
            });
            
            return response.ok;
        } catch (error) {
            console.error('Token verification failed:', error);
            return false;
        }
    }

    /**
     * Refreshes the access token using the refresh token.
     * @returns Promise<IAuthTokens> - New access and refresh tokens.
     * @throws Error if refresh fails.
     */
    static async refreshToken(): Promise<IAuthTokens> {
        const refreshToken = AuthService.getTokens().refresh;
        
        if (!refreshToken) {
            this.clearTokens();
            throw new Error('Aucun refresh token disponible');
        }

        const response = await fetch(`${this.BASE_URL}${this.REFRESH_TOKEN_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken })
        });

        if (!response.ok) {
            this.clearTokens();
            throw new Error('Session expirée, veuillez vous reconnecter');
        }

        const tokens: IAuthTokens = await response.json();
        this.setTokens(tokens);

        return tokens;
    }

    static setTokens(tokens: IAuthTokens): void
    {
        localStorage.setItem(LS_ACCESS_TOKEN, tokens.access);
        localStorage.setItem(LS_REFRESH_TOKEN, tokens.refresh);
    }

    /**
     * Retrieves JWT tokens from localStorage
     * @returns { access: string | null, refresh: string | null } - Access and refresh tokens
     */
    static getTokens(): IAuthTokens
    {
        const access = localStorage.getItem(LS_ACCESS_TOKEN) || 'no_access_token';
        const refresh = localStorage.getItem(LS_REFRESH_TOKEN) || 'no_refresh_token';

        return { access, refresh };
    }

    /**
     * Deletes JWT tokens from localStorage
     */
    static clearTokens(): void 
    {
        localStorage.removeItem(LS_ACCESS_TOKEN);
        localStorage.removeItem(LS_REFRESH_TOKEN);
    }

    /**
     * Checks whether a user is currently authenticated.
     * @returns boolean - True if an access token is present.
     */
    static isAuthenticated(): boolean
    {
        return !!localStorage.getItem(LS_ACCESS_TOKEN);
    }

    /**
     * Checks if the user is authenticated with a valid token.
     * @returns Promise<boolean> - True if the user has a valid token.
     */
    static async isValidAuthentication(): Promise<boolean> {
        const token = this.getTokens().access;
        
        if (!token) {
            return false;
        }

        return await this.verifyToken(token);
    }

    /**
     * Logs the user out by deleting the tokens 
     * and tell the server to invalidate the token
     */
    static destroyToken(): void
    {
        //API call for token invalidation
        fetch(`${this.BASE_URL}${this.LOGOUT_URL}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AuthService.getTokens().access}`,
            },
        }).catch(console.error);

        this.clearTokens();
    }

    /**
     * Updates a user's information
     * @param userId - User ID to update (optional, uses current user if not provided)
     * @param userData - Partial user data to update
     * @param isPartial - Whether to use PATCH (partial) or PUT (complete) update
     * @returns Promise<boolean> - True if update was successful
     */
    static async updateUser(
        userData: Partial<IUser>, 
        userId?: string, 
        isPartial: boolean = true
    ): Promise<boolean> 
    {
        try {
            const token = this.getTokens().access;
            
            // Determine the endpoint URL
            const endpoint = userId 
                ? `${this.BASE_URL}/users/${userId}/`
                : `${this.BASE_URL}${this.CURRENT_USER_URL}`;

            const method = isPartial ? 'PATCH' : 'PUT';

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                console.error(`User update failed: ${response.status}`, await response.text());
                return false;
            }

            // Update the current user cache if modifying the current user
            if (!userId) {
                AuthService.currentUser = await response.json();
            }

            console.log('✅ User updated successfully');
            return true;

        } catch (error) {
            console.error('User update failed:', error);
            return false;
        }
    }

    /**
     * Changes the current user's password
     * @param currentPassword - Current password for verification
     * @param newPassword - New password to set
     * @returns Promise<boolean> - True if password change was successful
     */
    static async changePassword(currentPassword: string, newPassword: string): Promise<boolean> 
    {
        try {
            const token = this.getTokens().access;

            const response = await fetch(`${this.BASE_URL}/users/set_password/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });

            if (!response.ok) {
                console.error(`Password change failed: ${response.status}`, await response.text());
                return false;
            }

            console.log('✅ Password changed successfully');
            return true;

        } catch (error) {
            console.error('Password change failed:', error);
            return false;
        }
    }

    /**
     * Changes the current user's email
     * @param newEmail - New email address
     * @param currentPassword - Current password for verification
     * @returns Promise<boolean> - True if email change was successful
     */
    static async changeEmail(newEmail: string, currentPassword: string): Promise<boolean> 
    {
        try {
            const token = this.getTokens().access;

            const response = await fetch(`${this.BASE_URL}/users/set_email/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    new_email: newEmail,
                    current_password: currentPassword
                })
            });

            if (!response.ok) {
                console.error(`Email change failed: ${response.status}`, await response.text());
                return false;
            }

            console.log('✅ Email changed successfully');
            return true;

        } catch (error) {
            console.error('Email change failed:', error);
            return false;
        }
    }
}
