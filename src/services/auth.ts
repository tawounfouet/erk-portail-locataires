import { IUser } from "@/types/user.type";
import { DEFAULT_USER } from "@/static/users.static";
import { IAuthTokens, ILoginResponse } from "@/types/auth.type";
import { ERK_API_URL } from "@/static/dev.static";

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
    private static readonly BASE_URL: string = `${ERK_API_URL}/auth`;
    private static readonly AUTHENTICATION_URL: string = "/jwt/create/";
    private static readonly LOGOUT_URL: string = "/jwt/logout/";
    private static readonly REFRESH_TOKEN_URL: string = "/jwt/refresh/";
    private static readonly VERIFY_TOKEN_URL: string = "/jwt/verify/";
    private static readonly CURRENT_USER_URL: string = "/users/me/";
    private static readonly USERS_URL: string = "/users/";
    private static readonly ACTIVATION_URL: string = "/users/activation/";
    private static readonly RESEND_ACTIVATION_URL: string = "/users/resend_activation/";
    private static readonly RESET_EMAIL_URL: string = "/users/reset_email/";
    private static readonly RESET_EMAIL_CONFIRM_URL: string = "/users/reset_email_confirm/";
    private static readonly RESET_PASSWORD_URL: string = "/users/reset_password/";
    private static readonly RESET_PASSWORD_CONFIRM_URL: string = "/users/reset_password_confirm/";
    private static readonly SET_EMAIL_URL: string = "/users/set_email/";
    private static readonly SET_PASSWORD_URL: string = "/users/set_password/";

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
            console.error(`Token verification failed: ${error}`);
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
     * Creates a new user account
     * @param userData - User creation data
     * @returns Promise<IUser | null> - Created user or null if failed
     */
    static async createUser(userData: {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        re_password: string;
    }): Promise<IUser | null> {
        try {
            const response = await fetch(`${this.BASE_URL}${this.USERS_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                console.error(`User creation failed: ${response.status}`, await response.text());
                return null;
            }

            const user: IUser = await response.json();
            console.log('✅ User created successfully');
            return user;

        } catch (error) {
            console.error('User creation failed:', error);
            return null;
        }
    }

    /**
     * Activates a user account
     * @param uid - User ID
     * @param token - Activation token
     * @returns Promise<boolean> - True if activation was successful
     */
    static async activateUser(uid: string, token: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.BASE_URL}${this.ACTIVATION_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid, token })
            });

            if (!response.ok) {
                console.error(`Activation failed: ${response.status}`, await response.text());
                return false;
            }

            console.log('✅ Account activated successfully');
            return true;

        } catch (error) {
            console.error('Activation failed:', error);
            return false;
        }
    }

    /**
     * Resends activation email
     * @param email - User's email address
     * @returns Promise<boolean> - True if email was sent successfully
     */
    static async resendActivation(email: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.BASE_URL}${this.RESEND_ACTIVATION_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                console.error(`Resend activation failed: ${response.status}`, await response.text());
                return false;
            }

            console.log('✅ Activation email sent successfully');
            return true;

        } catch (error) {
            console.error('Resend activation failed:', error);
            return false;
        }
    }

    /**
     * Gets list of users (requires authentication)
     * @param page - Page number for pagination
     * @returns Promise<IUser[] | null> - List of users or null if failed
     */
    static async getUsers(page?: number): Promise<IUser[] | null> {
        try {
            const token = this.getTokens().access;
            const params = page ? `?page=${page}` : '';
            
            const response = await fetch(`${this.BASE_URL}${this.USERS_URL}${params}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                console.error(`Get users failed: ${response.status}`, await response.text());
                return null;
            }

            const data = await response.json();
            return data.results;

        } catch (error) {
            console.error('Get users failed:', error);
            return null;
        }
    }

    /**
     * Gets a specific user by ID
     * @param userId - User ID
     * @returns Promise<IUser | null> - User data or null if failed
     */
    static async getUserById(userId: string): Promise<IUser | null> {
        try {
            const token = this.getTokens().access;
            
            const response = await fetch(`${this.BASE_URL}${this.USERS_URL}${userId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                console.error(`Get user failed: ${response.status}`, await response.text());
                return null;
            }

            const user: IUser = await response.json();
            return user;

        } catch (error) {
            console.error('Get user failed:', error);
            return null;
        }
    }

    /**
     * Updates a user's information
     * @param userData - Partial user data to update
     * @param userId - User ID to update (optional, uses current user if not provided)
     * @param isPartial - Whether to use PATCH (partial) or PUT (complete) update
     * @returns Promise<IUser | null> - Updated user data or null if failed
     */
    static async updateUser(
        userData: Partial<IUser>,
        userId?: string,
        isPartial: boolean = true
    ): Promise<IUser | null> {
        try {
            const token = this.getTokens().access;
            
            // Determine the endpoint URL
            const endpoint = userId 
                ? `${this.BASE_URL}${this.USERS_URL}${userId}/`
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
                return null;
            }

            const updatedUser: IUser = await response.json();

            // Update the current user cache if modifying the current user
            if (!userId) {
                AuthService.currentUser = updatedUser;
            }

            console.log('✅ User updated successfully');
            return updatedUser;

        } catch (error) {
            console.error('User update failed:', error);
            return null;
        }
    }

    /**
     * Deletes the current user's account
     * @returns Promise<boolean> - True if deletion was successful
     */
    static async deleteCurrentUser(): Promise<boolean> {
        try {
            const token = this.getTokens().access;

            const response = await fetch(`${this.BASE_URL}${this.CURRENT_USER_URL}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                console.error(`User deletion failed: ${response.status}`, await response.text());
                return false;
            }

            this.clearTokens();
            this.currentUser = null;
            console.log('✅ User account deleted successfully');
            return true;

        } catch (error) {
            console.error('User deletion failed:', error);
            return false;
        }
    }

    /**
     * Initiates password reset process
     * @param email - User's email address
     * @returns Promise<boolean> - True if reset email was sent successfully
     */
    static async resetPassword(email: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.BASE_URL}${this.RESET_PASSWORD_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                console.error(`Password reset request failed: ${response.status}`, await response.text());
                return false;
            }

            console.log('✅ Password reset email sent successfully');
            return true;

        } catch (error) {
            console.error('Password reset request failed:', error);
            return false;
        }
    }

    /**
     * Confirms password reset with token
     * @param uid - User ID
     * @param token - Reset token
     * @param newPassword - New password
     * @returns Promise<boolean> - True if password was reset successfully
     */
    static async resetPasswordConfirm(uid: string, token: string, newPassword: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.BASE_URL}${this.RESET_PASSWORD_CONFIRM_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid, token, new_password: newPassword })
            });

            if (!response.ok) {
                console.error(`Password reset confirmation failed: ${response.status}`, await response.text());
                return false;
            }

            console.log('✅ Password reset successfully');
            return true;

        } catch (error) {
            console.error('Password reset confirmation failed:', error);
            return false;
        }
    }

    /**
     * Changes the current user's password
     * @param currentPassword - Current password for verification
     * @param newPassword - New password to set
     * @returns Promise<boolean> - True if password change was successful
     */
    static async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
        try {
            const token = this.getTokens().access;

            const response = await fetch(`${this.BASE_URL}${this.SET_PASSWORD_URL}`, {
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
    static async changeEmail(newEmail: string, currentPassword: string): Promise<boolean> {
        try {
            const token = this.getTokens().access;

            const response = await fetch(`${this.BASE_URL}${this.SET_EMAIL_URL}`, {
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

    /**
     * Initiates email reset process
     * @param email - Current email address
     * @returns Promise<boolean> - True if reset email was sent successfully
     */
    static async resetEmail(email: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.BASE_URL}${this.RESET_EMAIL_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                console.error(`Email reset request failed: ${response.status}`, await response.text());
                return false;
            }

            console.log('✅ Email reset instructions sent successfully');
            return true;

        } catch (error) {
            console.error('Email reset request failed:', error);
            return false;
        }
    }

    /**
     * Confirms email reset with new email
     * @param newEmail - New email address
     * @returns Promise<boolean> - True if email was reset successfully
     */
    static async resetEmailConfirm(newEmail: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.BASE_URL}${this.RESET_EMAIL_CONFIRM_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ new_email: newEmail })
            });

            if (!response.ok) {
                console.error(`Email reset confirmation failed: ${response.status}`, await response.text());
                return false;
            }

            console.log('✅ Email reset successfully');
            return true;

        } catch (error) {
            console.error('Email reset confirmation failed:', error);
            return false;
        }
    }

    /**
     * Silent token refresh - tries to refresh token without user interaction
     * @returns Promise<boolean> - True if token was refreshed successfully
     */
    static async silentRefresh(): Promise<boolean> {
        try {
            const tokens = await this.refreshToken();
            console.log('🔐 Token silently refreshed');
            return true;
        } catch (error) {
            console.log('🔐 Silent refresh failed, user needs to login again');
            this.clearTokens();
            return false;
        }
    }

    /**
     * Checks and maintains authentication state
     * Should be called periodically or before API calls
     * @returns Promise<boolean> - True if user is properly authenticated
     */
    static async checkAndMaintainAuth(): Promise<boolean> {
        const token = this.getTokens().access;
        
        if (!token || token === 'no_access_token') {
            return false;
        }

        // Check if token is about to expire (optional: decode JWT to check expiry)
        const isTokenValid = await this.verifyToken(token);
        
        if (!isTokenValid) {
            // Try to refresh the token
            return await this.silentRefresh();
        }

        return true;
    }

    /**
     * Partially updates the current user's profile information
     * @param userData - Partial user data to update
     * @returns Promise<IUser | null> - Updated user data or null if failed
     */
    static async partialUpdateCurrentUser(userData: Partial<{
        email: string;
        first_name: string;
        last_name: string;
        phone?: string | null;
        is_active?: boolean;
        is_tenant?: boolean;
    }>): Promise<IUser | null> {
        try {
            const token = this.getTokens().access;
            
            const response = await fetch(`${this.BASE_URL}${this.CURRENT_USER_URL}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                console.error(`User partial update failed: ${response.status}`, await response.text());
                return null;
            }

            const updatedUser: IUser = await response.json();
            
            // Update the cached current user
            AuthService.currentUser = updatedUser;
            
            return updatedUser;

        } catch (error) {
            console.error('User partial update failed:', error);
            return null;
        }
    }
}
