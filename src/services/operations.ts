import { 
  IAttachment, IOperationComment, IHistoryLog,
  IOperationList, IOperationDetail,
  IAttachmentFilters, IOperationFilters, ICommentFilters,
  TAttachmentType, TOperationStatus,
  TOperationCategory,
  IPaginatedResponse,
  IOperationType,
  TPriority,
  IOperationCategory
} from '@/types/operations.type';
import AuthService from './auth';
import { ERK_API_URL } from '@/static/dev.static';

/**
 * Operations service for managing maintenance operations, attachments, comments and history
 * Provides CRUD operations for the entire operations management system
 */
export default class OperationService 
{
    // Base URLs for the operations API endpoints
    private static readonly BASE_URL: string = ERK_API_URL;
    private static readonly ATTACHMENTS_URL: string = "/operations/attachments/";
    private static readonly COMMENTS_URL: string = "/operations/comments/";
    private static readonly HISTORY_URL: string = "/operations/history/";
    private static readonly NOTIFICATIONS_URL: string = "/operations/notifications/";
    private static readonly OPERATIONS_URL: string = "/operations/operations/";
    private static readonly TYPES_URL: string = "/operations/types/";
    private static readonly TYPES_BY_CATEGORY_URL: string = "/operations/types/by_category/";
    private static readonly TYPES_REQUIRING_APPROVAL_URL: string = "/operations/types/requiring_approval/";
    private static readonly CATEGORIES_URL: string = "/operations/categories/";

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
        const accessToken = tokens.access !== 'no_access_token' ? tokens.access : null;

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

    // ===== ATTACHMENTS MANAGEMENT =====

    /**
     * Retrieves all attachments with optional filtering
     * @param filters - Filter criteria for attachments
     * @returns Promise<IAttachment[]> - List of attachments
     */
    static async getAttachments(filters: IAttachmentFilters = {}): Promise<IAttachment[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<IAttachment[]>(`${this.ATTACHMENTS_URL}?${params}`);
    }

    /**
     * Retrieves a specific attachment by ID
     * @param id - Attachment UUID
     * @returns Promise<IAttachment> - Attachment details
     */
    static async getAttachmentById(id: string): Promise<IAttachment> 
    {
        return this.request<IAttachment>(`${this.ATTACHMENTS_URL}${id}/`);
    }

    /**
     * Creates a new attachment
     * @param data - Attachment data to create
     * @returns Promise<IAttachment> - Created attachment
     */
    static async createAttachment(data: Partial<IAttachment>): Promise<IAttachment> 
    {
        return this.request<IAttachment>(this.ATTACHMENTS_URL, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * Updates an existing attachment
     * @param id - Attachment UUID to update
     * @param data - Updated attachment data
     * @returns Promise<IAttachment> - Updated attachment
     */
    static async updateAttachment(id: string, data: Partial<IAttachment>): Promise<IAttachment> 
    {
        return this.request<IAttachment>(`${this.ATTACHMENTS_URL}${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    /**
     * Partially updates an attachment (PATCH)
     * @param id - Attachment UUID to update
     * @param data - Partial attachment data to update
     * @returns Promise<IAttachment> - Updated attachment
     */
    static async partialUpdateAttachment(id: string, data: Partial<IAttachment>): Promise<IAttachment> 
    {
        return this.request<IAttachment>(`${this.ATTACHMENTS_URL}${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    /**
     * Deletes an attachment
     * @param id - Attachment UUID to delete
     * @returns Promise<void>
     */
    static async deleteAttachment(id: string): Promise<void> 
    {
        return this.request(`${this.ATTACHMENTS_URL}${id}/`, {
            method: 'DELETE',
        });
    }

    /**
     * Retrieves attachments for a specific operation
     * @param filters - Filter criteria including operation ID
     * @returns Promise<IAttachment[]> - List of operation attachments
     */
    static async getAttachmentsByOperation(filters: IAttachmentFilters = {}): Promise<IAttachment[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<IAttachment[]>(`${this.ATTACHMENTS_URL}by_operation/?${params}`);
    }

    /**
     * Retrieves attachments by specific type
     * @param filters - Filter criteria including attachment type
     * @returns Promise<IAttachment[]> - List of filtered attachments
     */
    static async getAttachmentsByType(filters: IAttachmentFilters = {}): Promise<IAttachment[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<IAttachment[]>(`${this.ATTACHMENTS_URL}by_type/?${params}`);
    }

    // ===== COMMENTS MANAGEMENT =====

    /**
     * Retrieves all operation comments with optional filtering
     * @param filters - Filter criteria for comments
     * @returns Promise<IOperationComment[]> - List of comments
     */
    static async getComments(filters: ICommentFilters = {}): Promise<IOperationComment[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<IOperationComment[]>(`${this.COMMENTS_URL}?${params}`);
    }

    /**
     * Retrieves a specific comment by ID
     * @param id - Comment UUID
     * @returns Promise<IOperationComment> - Comment details
     */
    static async getCommentById(id: string): Promise<IOperationComment> 
    {
        return this.request<IOperationComment>(`${this.COMMENTS_URL}${id}/`);
    }

    /**
     * Creates a new operation comment
     * @param data - Comment data to create
     * @returns Promise<IOperationComment> - Created comment
     */
    static async createComment(data: Partial<IOperationComment>): Promise<IOperationComment> 
    {
        return this.request<IOperationComment>(this.COMMENTS_URL, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * Retrieves comments for a specific operation
     * @param filters - Filter criteria including operation ID
     * @returns Promise<IOperationComment[]> - List of operation comments
     */
    static async getCommentsByOperation(filters: ICommentFilters = {}): Promise<IOperationComment[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<IOperationComment[]>(`${this.COMMENTS_URL}by_operation/?${params}`);
    }

    /**
     * Retrieves replies to a specific comment
     * @param id - Parent comment UUID
     * @returns Promise<IOperationComment[]> - List of comment replies
     */
    static async getCommentReplies(id: string): Promise<IOperationComment[]> 
    {
        return this.request<IOperationComment[]>(`${this.COMMENTS_URL}${id}/replies/`);
    }

    // ===== OPERATIONS MANAGEMENT =====

    /**
     * Retrieves all operations with optional filtering
     * @param filters - Filter criteria for operations
     * @returns Promise<IOperationList[]> - List of operations
     */
    static async getOperations(filters: IOperationFilters = {}): Promise<IOperationList[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<IOperationList[]>(`${this.OPERATIONS_URL}?${params}`);
    }

    /**
     * Retrieves a specific operation by ID with full details
     * @param id - Operation UUID
     * @returns Promise<IOperationDetail> - Operation details with comments and history
     */
    static async getOperationById(id: string): Promise<IOperationDetail> 
    {
        return this.request<IOperationDetail>(`${this.OPERATIONS_URL}${id}/`);
    }

    /**
     * Creates a new operation
     * @param data - Operation data to create
     * @returns Promise<IOperationList> - Created operation
     */
    static async createOperation(data: Partial<IOperationList>): Promise<IOperationList> 
    {
        return this.request<IOperationList>(this.OPERATIONS_URL, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * Updates an existing operation
     * @param id - Operation UUID to update
     * @param data - Updated operation data
     * @returns Promise<IOperationList> - Updated operation
     */
    static async updateOperation(id: string, data: Partial<IOperationList>): Promise<IOperationList> 
    {
        return this.request<IOperationList>(`${this.OPERATIONS_URL}${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // ===== SPECIALIZED OPERATIONS QUERIES =====

    /**
     * Retrieves operations assigned to the current user
     * @param filters - Additional filter criteria
     * @returns Promise<IOperationList[]> - List of assigned operations
     */
    static async getAssignedToMe(filters: IOperationFilters = {}): Promise<IOperationList[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<IOperationList[]>(`${this.OPERATIONS_URL}assigned_to_me/?${params}`);
    }

    /**
     * Retrieves operations created by the current user
     * @param filters - Additional filter criteria
     * @returns Promise<IOperationList[]> - List of user's operations
     */
    static async getMyOperations(filters: IOperationFilters = {}): Promise<IOperationList[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<IOperationList[]>(`${this.OPERATIONS_URL}my_operations/?${params}`);
    }

    /**
     * Retrieves high priority operations
     * @param filters - Additional filter criteria
     * @returns Promise<IOperationList[]> - List of high priority operations
     */
    static async getHighPriority(filters: IOperationFilters = {}): Promise<IOperationList[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<IOperationList[]>(`${this.OPERATIONS_URL}high_priority/?${params}`);
    }

    /**
     * Retrieves overdue operations
     * @param filters - Additional filter criteria
     * @returns Promise<IOperationList[]> - List of overdue operations
     */
    static async getOverdue(filters: IOperationFilters = {}): Promise<IOperationList[]> 
    {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<IOperationList[]>(`${this.OPERATIONS_URL}overdue/?${params}`);
    }

    // ===== OPERATION ACTIONS =====

    /**
     * Assigns an operation to a user
     * @param id - Operation UUID to assign
     * @param assignedTo - User UUID to assign to
     * @returns Promise<IOperationList> - Updated operation
     */
    static async assignOperation(id: string, assignedTo: string): Promise<IOperationList> 
    {
        return this.request<IOperationList>(`${this.OPERATIONS_URL}${id}/assign/`, {
            method: 'POST',
            body: JSON.stringify({ assigned_to: assignedTo }),
        });
    }

    /**
     * Changes the status of an operation
     * @param id - Operation UUID to update
     * @param status - New operation status
     * @returns Promise<IOperationList> - Updated operation
     */
    static async changeOperationStatus(id: string, status: TOperationStatus): Promise<IOperationList> 
    {
        return this.request<IOperationList>(`${this.OPERATIONS_URL}${id}/change_status/`, {
            method: 'POST',
            body: JSON.stringify({ status }),
        });
    }

    /**
     * Marks an operation as completed
     * @param id - Operation UUID to complete
     * @returns Promise<IOperationList> - Completed operation
     */
    static async completeOperation(id: string): Promise<IOperationList> 
    {
        return this.request<IOperationList>(`${this.OPERATIONS_URL}${id}/complete/`, {
            method: 'POST',
        });
    }

    static async getHistoryByOperation(filters: IOperationFilters = {}): Promise<IHistoryLog[]> {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
        }
        });

        return this.request<IHistoryLog[]>(`/operations/history/by_operation/?${params}`);
    }

    // ===== UTILITY METHODS =====

    /**
     * Uploads a file and creates an attachment
     * @param file - File to upload
     * @param attachmentType - Type of attachment
     * @returns Promise<IAttachment> - Created attachment
     */
    static async uploadFile(file: File, attachmentType: TAttachmentType): Promise<IAttachment> 
    {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('attachment_type', attachmentType);

        const tokens = AuthService.getTokens();
        const accessToken = tokens.access !== 'no_access_token' ? tokens.access : null;

        const response = await fetch(`${this.BASE_URL}${this.ATTACHMENTS_URL}`, {
            method: 'POST',
            headers: {
                ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Retrieves complete timeline for an operation (comments, history, attachments)
     * @param operationId - Operation UUID
     * @returns Promise with operation timeline data
     */
    static async getOperationTimeline(operationId: string): Promise<{
        comments: IOperationComment[];
        history: IHistoryLog[];
        attachments: IAttachment[];
    }> 
    {
        const [comments, history, attachments] = await Promise.all([
            this.getCommentsByOperation({ operation: operationId }),
            this.getHistoryByOperation({ operation: operationId }),
            this.getAttachmentsByOperation({ related_operation: operationId })
        ]);

        return { comments, history, attachments };
    }

    /**
     * Retrieves dashboard statistics for operations
     * @returns Promise with operation statistics
     */
    static async getDashboardStats(): Promise<{
        total: number;
        inProgress: number;
        completed: number;
        overdue: number;
        highPriority: number;
    }> 
    {
        const [
            allOperations,
            inProgress,
            overdue,
            highPriority
        ] = await Promise.all([
            this.getOperations(),
            this.getOperations({ status: 'IN_PROGRESS' }),
            this.getOverdue(),
            this.getHighPriority()
        ]);

        const completed = allOperations.filter(op => op.status === 'COMPLETED').length;

        return {
            total: allOperations.length,
            inProgress: inProgress.length,
            completed,
            overdue: overdue.length,
            highPriority: highPriority.length
        };
    }

    // =========================================================================
    // OPERATION TYPES MANAGEMENT
    // =========================================================================

    /**
     * Retrieves all operation types with optional filtering and pagination
     * @param filters - Filtering options for operation types
     * @returns Paginated list of operation types
     */
    static async getOperationTypes(filters: {
        category?: TOperationCategory;
        requires_approval?: boolean;
        is_active?: boolean;
        search?: string;
        ordering?: string;
        page?: number;
    } = {}): Promise<IPaginatedResponse<IOperationType>> {
        const params = new URLSearchParams();
        
        if (filters?.category) params.append('category', filters.category);
        if (filters?.requires_approval !== undefined) params.append('requires_approval', filters.requires_approval.toString());
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.ordering) params.append('ordering', filters.ordering);
        if (filters?.page) params.append('page', filters.page.toString());

        const queryString = params.toString();
        const endpoint = queryString ? `${this.TYPES_URL}?${queryString}` : this.TYPES_URL;

        return this.request<IPaginatedResponse<IOperationType>>(endpoint);
    }

    /**
     * Retrieves operation types grouped by category
     * @param filters - Filtering options
     * @returns Paginated list of operation types grouped by category
     */
    static async getOperationTypesByCategory(filters: {
        category?: TOperationCategory;
        requires_approval?: boolean;
        is_active?: boolean;
        search?: string;
        ordering?: string;
        page?: number;
    } = {}): Promise<IPaginatedResponse<IOperationType>> {
        const params = new URLSearchParams();
        
        if (filters?.category) params.append('category', filters.category);
        if (filters?.requires_approval !== undefined) params.append('requires_approval', filters.requires_approval.toString());
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.ordering) params.append('ordering', filters.ordering);
        if (filters?.page) params.append('page', filters.page.toString());

        const queryString = params.toString();
        const endpoint = queryString ? `${this.TYPES_BY_CATEGORY_URL}?${queryString}` : this.TYPES_BY_CATEGORY_URL;

        return this.request<IPaginatedResponse<IOperationType>>(endpoint);
    }

    /**
     * Retrieves operation types that require approval
     * @param filters - Filtering options
     * @returns Paginated list of operation types requiring approval
     */
    static async getOperationTypesRequiringApproval(filters: {
        category?: TOperationCategory;
        requires_approval?: boolean;
        is_active?: boolean;
        search?: string;
        ordering?: string;
        page?: number;
    } = {}): Promise<IPaginatedResponse<IOperationType>> {
        const params = new URLSearchParams();
        
        if (filters?.category) params.append('category', filters.category);
        if (filters?.requires_approval !== undefined) params.append('requires_approval', filters.requires_approval.toString());
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.ordering) params.append('ordering', filters.ordering);
        if (filters?.page) params.append('page', filters.page.toString());

        const queryString = params.toString();
        const endpoint = queryString ? `${this.TYPES_REQUIRING_APPROVAL_URL}?${queryString}` : this.TYPES_REQUIRING_APPROVAL_URL;

        return this.request<IPaginatedResponse<IOperationType>>(endpoint);
    }

    /**
     * Retrieves a specific operation type by ID
     * @param id - Operation type UUID
     * @returns Operation type details
     */
    static async getOperationTypeById(id: string): Promise<IOperationType> {
        return this.request<IOperationType>(`${this.TYPES_URL}${id}/`);
    }

    /**
     * Creates a new operation type
     * @param operationTypeData - Operation type creation data
     * @returns Created operation type
     */
    static async createOperationType(operationTypeData: {
        name: string;
        code: string;
        category?: TOperationCategory;
        description?: string;
        requires_approval?: boolean;
        auto_assign_rules?: Record<string, any>;
        default_priority?: TPriority;
        sla_hours?: number;
        color_code?: string;
        icon_name?: string;
        default_icon?: string;
        is_active?: boolean;
    }): Promise<IOperationType> {
        return this.request<IOperationType>(this.TYPES_URL, {
            method: 'POST',
            body: JSON.stringify(operationTypeData)
        });
    }

    /**
     * Updates an existing operation type (full update)
     * @param id - Operation type UUID
     * @param operationTypeData - Complete operation type data
     * @returns Updated operation type
     */
    static async updateOperationType(
        id: string, 
        operationTypeData: {
            name: string;
            code: string;
            category?: TOperationCategory;
            description?: string;
            requires_approval?: boolean;
            auto_assign_rules?: Record<string, any>;
            default_priority?: TPriority;
            sla_hours?: number;
            color_code?: string;
            icon_name?: string;
            default_icon?: string;
            is_active?: boolean;
        }
    ): Promise<IOperationType> {
        return this.request<IOperationType>(`${this.TYPES_URL}${id}/`, {
            method: 'PUT',
            body: JSON.stringify(operationTypeData)
        });
    }

    /**
     * Partially updates an operation type
     * @param id - Operation type UUID
     * @param partialData - Partial operation type data
     * @returns Updated operation type
     */
    static async partialUpdateOperationType(
        id: string, 
        partialData: Partial<{
            name: string;
            code: string;
            category: TOperationCategory;
            description: string;
            requires_approval: boolean;
            auto_assign_rules: Record<string, any>;
            default_priority: TPriority;
            sla_hours: number;
            color_code: string;
            icon_name: string;
            default_icon: string;
            is_active: boolean;
        }>
    ): Promise<IOperationType> {
        return this.request<IOperationType>(`${this.TYPES_URL}${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(partialData)
        });
    }

    /**
     * Deletes an operation type
     * @param id - Operation type UUID
     */
    static async deleteOperationType(id: string): Promise<void> {
        return this.request<void>(`${this.TYPES_URL}${id}/`, {
            method: 'DELETE'
        });
    }

    /**
     * Utility method to get all active operation types (convenience method)
     * @returns List of active operation types
     */
    static async getActiveOperationTypes(): Promise<IPaginatedResponse<IOperationType>> {
        return this.getOperationTypes({ is_active: true });
    }

    /**
     * Utility method to get operation types by specific category
     * @param category - Operation category
     * @returns List of operation types in the specified category
     */
    static async getOperationTypesBySpecificCategory(category: TOperationCategory): Promise<IPaginatedResponse<IOperationType>> {
        return this.getOperationTypes({ category, is_active: true });
    }

    /**
     * Retrieves all operation categories with optional filtering and pagination
     * @param filters - Filtering options for operation categories
     * @returns Paginated list of operation categories
     */
    static async getOperationCategories(filters: {
        is_active?: boolean;
        code?: string;
        search?: string;
        ordering?: string;
        page?: number;
    } = {}): Promise<IPaginatedResponse<IOperationCategory>> {
        const params = new URLSearchParams();
        
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.code) params.append('code', filters.code);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.ordering) params.append('ordering', filters.ordering);
        if (filters?.page) params.append('page', filters.page.toString());

        const queryString = params.toString();
        const endpoint = queryString ? `${this.CATEGORIES_URL}?${queryString}` : this.CATEGORIES_URL;

        return this.request<IPaginatedResponse<IOperationCategory>>(endpoint);
    }

    /**
     * Retrieves a specific operation category by ID
     * @param id - Operation category UUID
     * @returns Operation category details
     */
    static async getOperationCategoryById(id: string): Promise<IOperationCategory> {
        return this.request<IOperationCategory>(`${this.CATEGORIES_URL}${id}/`);
    }

    /**
     * Retrieves operation categories by code
     * @param code - Category code to filter by
     * @returns List of operation categories with the specified code
     */
    static async getOperationCategoriesByCode(code: string): Promise<IPaginatedResponse<IOperationCategory>> {
        return this.getOperationCategories({ code, is_active: true });
    }

    /**
     * Utility method to get all active operation categories
     * @returns List of active operation categories
     */
    static async getActiveOperationCategories(): Promise<IPaginatedResponse<IOperationCategory>> {
        return this.getOperationCategories({ is_active: true });
    }

    /**
     * Utility method to get operation categories sorted by display order
     * @returns List of operation categories sorted by sort_order
     */
    static async getSortedOperationCategories(): Promise<IPaginatedResponse<IOperationCategory>> {
        return this.getOperationCategories({ 
            is_active: true, 
            ordering: 'sort_order,name' 
        });
    }
}