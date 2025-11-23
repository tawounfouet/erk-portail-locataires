import { 
  ISuggestionComment, 
  ISuggestionResponse, 
  ISuggestionList, 
  ISuggestionDetail,
  ISuggestionCreate,
  ISuggestionCommentFilters,
  ISuggestionResponseFilters,
  ISuggestionFilters,
  TSuggestionStatus,
} from '@/types/suggestions.type';
import AuthService from './auth';
import { ERK_API_URL } from '@/static/dev.static';


/**
 * Suggestions service for managing suggestions, comments, and responses
 * Provides CRUD operations for the entire suggestions management system
 */
export default class SuggestionService 
{
    // Base URLs for the suggestions API endpoints
    private static readonly BASE_URL: string = ERK_API_URL;
    private static readonly COMMENTS_URL: string = "/suggestions/comments/";
    private static readonly RESPONSES_URL: string = "/suggestions/responses/";
    private static readonly SUGGESTIONS_URL: string = "/suggestions/suggestions/";

    /**
     * Generic request method for all API calls with error handling
     * @param endpoint - API endpoint to call
     * @param options - Fetch options (method, headers, body, etc.)
     * @returns Promise<T> - Response data
     * @throws Error if request fails
     */
    private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T>
    {
        const url = `${this.BASE_URL}${endpoint}`;
        
        // Get authentication token
        const tokens = AuthService.getTokens();
        const accessToken = tokens.access;

        // Prepare request configuration
        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) 
            {
                // Handle token expiration
                if (response.status === 401 && accessToken) {
                    try {
                        // Try to refresh token
                        const newTokens = await AuthService.refreshToken();
                        config.headers = {
                            ...config.headers,
                            'Authorization': `Bearer ${newTokens.access}`
                        };
                        
                        // Retry request with new token
                        const retryResponse = await fetch(url, config);
                        if (!retryResponse.ok) {
                            throw new Error(`HTTP error! status: ${retryResponse.status}`);
                        }
                        return await retryResponse.json();
                    } catch (error) {
                        AuthService.clearTokens();
                        console.error('Error: ', error);
                        throw new Error('Session expirée, veuillez vous reconnecter');
                    }
                }
                
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // ===== COMMENTS MANAGEMENT =====

    /**
     * Retrieves all suggestion comments with optional filtering
     * @param filters - Filter criteria for comments
     * @returns Promise<ISuggestionComment[]> - List of comments
     */
    static async getComments(filters: ISuggestionCommentFilters = {}): Promise<ISuggestionComment[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<ISuggestionComment[]>(`${this.COMMENTS_URL}?${params}`);
    }

    /**
     * Retrieves a specific comment by ID
     * @param id - Comment UUID
     * @returns Promise<ISuggestionComment> - Comment details
     */
    static async getCommentById(id: string): Promise<ISuggestionComment> 
    {
        return this.request<ISuggestionComment>(`${this.COMMENTS_URL}${id}/`);
    }

    /**
     * Creates a new suggestion comment
     * @param data - Comment data to create
     * @returns Promise<ISuggestionComment> - Created comment
     */
    static async createComment(data: Partial<ISuggestionComment>): Promise<ISuggestionComment> 
    {
        return this.request<ISuggestionComment>(this.COMMENTS_URL, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * Updates an existing comment
     * @param id - Comment UUID to update
     * @param data - Updated comment data
     * @returns Promise<ISuggestionComment> - Updated comment
     */
    static async updateComment(id: string, data: Partial<ISuggestionComment>): Promise<ISuggestionComment> 
    {
        return this.request<ISuggestionComment>(`${this.COMMENTS_URL}${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    /**
     * Partially updates a comment (PATCH)
     * @param id - Comment UUID to update
     * @param data - Partial comment data to update
     * @returns Promise<ISuggestionComment> - Updated comment
     */
    static async partialUpdateComment(id: string, data: Partial<ISuggestionComment>): Promise<ISuggestionComment> 
    {
        return this.request<ISuggestionComment>(`${this.COMMENTS_URL}${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    /**
     * Deletes a comment
     * @param id - Comment UUID to delete
     * @returns Promise<void>
     */
    static async deleteComment(id: string): Promise<void> 
    {
        return this.request(`${this.COMMENTS_URL}${id}/`, {
            method: 'DELETE',
        });
    }

    // ===== RESPONSES MANAGEMENT =====

    /**
     * Retrieves all suggestion responses with optional filtering
     * @param filters - Filter criteria for responses
     * @returns Promise<ISuggestionResponse[]> - List of responses
     */
    static async getResponses(filters: ISuggestionResponseFilters = {}): Promise<ISuggestionResponse[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<ISuggestionResponse[]>(`${this.RESPONSES_URL}?${params}`);
    }

    /**
     * Retrieves a specific response by ID
     * @param id - Response UUID
     * @returns Promise<ISuggestionResponse> - Response details
     */
    static async getResponseById(id: string): Promise<ISuggestionResponse> 
    {
        return this.request<ISuggestionResponse>(`${this.RESPONSES_URL}${id}/`);
    }

    /**
     * Creates a new suggestion response
     * @param data - Response data to create
     * @returns Promise<ISuggestionResponse> - Created response
     */
    static async createResponse(data: Partial<ISuggestionResponse>): Promise<ISuggestionResponse> 
    {
        return this.request<ISuggestionResponse>(this.RESPONSES_URL, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * Updates an existing response
     * @param id - Response UUID to update
     * @param data - Updated response data
     * @returns Promise<ISuggestionResponse> - Updated response
     */
    static async updateResponse(id: string, data: Partial<ISuggestionResponse>): Promise<ISuggestionResponse> 
    {
        return this.request<ISuggestionResponse>(`${this.RESPONSES_URL}${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    /**
     * Partially updates a response (PATCH)
     * @param id - Response UUID to update
     * @param data - Partial response data to update
     * @returns Promise<ISuggestionResponse> - Updated response
     */
    static async partialUpdateResponse(id: string, data: Partial<ISuggestionResponse>): Promise<ISuggestionResponse> 
    {
        return this.request<ISuggestionResponse>(`${this.RESPONSES_URL}${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    /**
     * Deletes a response
     * @param id - Response UUID to delete
     * @returns Promise<void>
     */
    static async deleteResponse(id: string): Promise<void> 
    {
        return this.request(`${this.RESPONSES_URL}${id}/`, {
            method: 'DELETE',
        });
    }

    /**
     * Resends email notification for a response
     * @param id - Response UUID
     * @returns Promise<ISuggestionResponse> - Response with updated email status
     */
    static async resendResponseEmail(id: string): Promise<ISuggestionResponse> 
    {
        return this.request<ISuggestionResponse>(`${this.RESPONSES_URL}${id}/resend_email/`, {
            method: 'POST',
        });
    }

    // ===== SUGGESTIONS MANAGEMENT =====

    /**
     * Retrieves all suggestions with optional filtering
     * @param filters - Filter criteria for suggestions
     * @returns Promise<ISuggestionList[]> - List of suggestions
     */
    static async getSuggestions(filters: ISuggestionFilters = {}): Promise<ISuggestionList[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<ISuggestionList[]>(`${this.SUGGESTIONS_URL}?${params}`);
    }

    /**
     * Retrieves a specific suggestion by ID with full details
     * @param id - Suggestion UUID
     * @returns Promise<ISuggestionDetail> - Suggestion details with comments and responses
     */
    static async getSuggestionById(id: string): Promise<ISuggestionDetail> 
    {
        return this.request<ISuggestionDetail>(`${this.SUGGESTIONS_URL}${id}/`);
    }

    /**
     * Creates a new suggestion
     * @param data - Suggestion data to create
     * @returns Promise<ISuggestionCreate> - Created suggestion
     */
    static async createSuggestion(data: Partial<ISuggestionCreate>): Promise<ISuggestionCreate> 
    {
        return this.request<ISuggestionCreate>(this.SUGGESTIONS_URL, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * Updates an existing suggestion
     * @param id - Suggestion UUID to update
     * @param data - Updated suggestion data
     * @returns Promise<ISuggestionDetail> - Updated suggestion
     */
    static async updateSuggestion(id: string, data: Partial<ISuggestionDetail>): Promise<ISuggestionDetail> 
    {
        return this.request<ISuggestionDetail>(`${this.SUGGESTIONS_URL}${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    /**
     * Partially updates a suggestion (PATCH)
     * @param id - Suggestion UUID to update
     * @param data - Partial suggestion data to update
     * @returns Promise<ISuggestionDetail> - Updated suggestion
     */
    static async partialUpdateSuggestion(id: string, data: Partial<ISuggestionDetail>): Promise<ISuggestionDetail> 
    {
        return this.request<ISuggestionDetail>(`${this.SUGGESTIONS_URL}${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    /**
     * Deletes a suggestion
     * @param id - Suggestion UUID to delete
     * @returns Promise<void>
     */
    static async deleteSuggestion(id: string): Promise<void> 
    {
        return this.request(`${this.SUGGESTIONS_URL}${id}/`, {
            method: 'DELETE',
        });
    }

    // ===== SPECIALIZED SUGGESTIONS QUERIES =====

    /**
     * Retrieves suggestions created by the current user
     * @param filters - Additional filter criteria
     * @returns Promise<ISuggestionDetail[]> - List of user's suggestions
     */
    static async getMySuggestions(filters: ISuggestionFilters = {}): Promise<ISuggestionDetail[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<ISuggestionDetail[]>(`${this.SUGGESTIONS_URL}my_suggestions/?${params}`);
    }

    /**
     * Retrieves implemented suggestions
     * @param filters - Additional filter criteria
     * @returns Promise<ISuggestionDetail[]> - List of implemented suggestions
     */
    static async getImplementedSuggestions(filters: ISuggestionFilters = {}): Promise<ISuggestionDetail[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<ISuggestionDetail[]>(`${this.SUGGESTIONS_URL}implemented/?${params}`);
    }

    /**
     * Retrieves pending suggestions awaiting review
     * @param filters - Additional filter criteria
     * @returns Promise<ISuggestionDetail[]> - List of pending suggestions
     */
    static async getPendingSuggestions(filters: ISuggestionFilters = {}): Promise<ISuggestionDetail[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<ISuggestionDetail[]>(`${this.SUGGESTIONS_URL}pending/?${params}`);
    }

    /**
     * Retrieves suggestions under review
     * @param filters - Additional filter criteria
     * @returns Promise<ISuggestionDetail[]> - List of suggestions under review
     */
    static async getUnderReviewSuggestions(filters: ISuggestionFilters = {}): Promise<ISuggestionDetail[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<ISuggestionDetail[]>(`${this.SUGGESTIONS_URL}under_review/?${params}`);
    }

    /**
     * Retrieves suggestions statistics
     * @param filters - Additional filter criteria
     * @returns Promise<ISuggestionDetail[]> - List of suggestions for statistics
     */
    static async getSuggestionsStatistics(filters: ISuggestionFilters = {}): Promise<ISuggestionDetail[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<ISuggestionDetail[]>(`${this.SUGGESTIONS_URL}statistics/?${params}`);
    }

    // ===== SUGGESTION ACTIONS =====

    /**
     * Adds a comment to a suggestion
     * @param id - Suggestion UUID
     * @param commentData - Comment data to add
     * @returns Promise<ISuggestionDetail> - Updated suggestion
     */
    static async addComment(id: string, commentData: Partial<ISuggestionComment>): Promise<ISuggestionDetail> 
    {
        return this.request<ISuggestionDetail>(`${this.SUGGESTIONS_URL}${id}/add_comment/`, {
            method: 'POST',
            body: JSON.stringify(commentData),
        });
    }

    /**
     * Adds a response to a suggestion
     * @param id - Suggestion UUID
     * @param responseData - Response data to add
     * @returns Promise<ISuggestionDetail> - Updated suggestion
     */
    static async addResponse(id: string, responseData: Partial<ISuggestionResponse>): Promise<ISuggestionDetail> 
    {
        return this.request<ISuggestionDetail>(`${this.SUGGESTIONS_URL}${id}/add_response/`, {
            method: 'POST',
            body: JSON.stringify(responseData),
        });
    }

    /**
     * Assigns a suggestion to a user
     * @param id - Suggestion UUID to assign
     * @param assignedTo - User UUID to assign to
     * @returns Promise<ISuggestionDetail> - Updated suggestion
     */
    static async assignSuggestion(id: string, assignedTo: string): Promise<ISuggestionDetail> 
    {
        return this.request<ISuggestionDetail>(`${this.SUGGESTIONS_URL}${id}/assign/`, {
            method: 'POST',
            body: JSON.stringify({ assigned_to: assignedTo }),
        });
    }

    /**
     * Changes the status of a suggestion
     * @param id - Suggestion UUID to update
     * @param status - New suggestion status
     * @returns Promise<ISuggestionDetail> - Updated suggestion
     */
    static async changeSuggestionStatus(id: string, status: TSuggestionStatus): Promise<ISuggestionDetail> 
    {
        return this.request<ISuggestionDetail>(`${this.SUGGESTIONS_URL}${id}/change_status/`, {
            method: 'POST',
            body: JSON.stringify({ status }),
        });
    }

    // ===== UTILITY METHODS =====

    /**
     * Retrieves complete timeline for a suggestion (comments, responses)
     * @param suggestionId - Suggestion UUID
     * @returns Promise with suggestion timeline data
     */
    static async getSuggestionTimeline(suggestionId: string): Promise<{
        comments: ISuggestionComment[];
        responses: ISuggestionResponse[];
    }> 
    {
        const [comments, responses] = await Promise.all([
            this.getComments({ suggestion: suggestionId }),
            this.getResponses({ suggestion: suggestionId })
        ]);

        return { comments, responses };
    }

    /**
     * Retrieves dashboard statistics for suggestions
     * @returns Promise with suggestion statistics
     */
    static async getDashboardStats(): Promise<{
        total: number;
        submitted: number;
        underReview: number;
        inProgress: number;
        implemented: number;
        rejected: number;
    }> 
    {
        const allSuggestions = await this.getSuggestions();
        
        return {
            total: allSuggestions.length,
            submitted: allSuggestions.filter(s => s.status === 'submitted').length,
            underReview: allSuggestions.filter(s => s.status === 'under_review').length,
            inProgress: allSuggestions.filter(s => s.status === 'in_progress').length,
            implemented: allSuggestions.filter(s => s.status === 'implemented').length,
            rejected: allSuggestions.filter(s => s.status === 'rejected').length
        };
    }

    /**
     * Searches suggestions by text
     * @param searchTerm - Search term
     * @param filters - Additional filter criteria
     * @returns Promise<ISuggestionList[]> - List of matching suggestions
     */
    static async searchSuggestions(searchTerm: string, filters: ISuggestionFilters = {}): Promise<ISuggestionList[]> 
    {
        const params = new URLSearchParams();
        params.append('search', searchTerm);
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<ISuggestionList[]>(`${this.SUGGESTIONS_URL}?${params}`);
    }
}