export type TAttachmentType = 
  | 'photo_before' | 'photo_after' | 'photo_progress' | 'document' 
  | 'invoice' | 'receipt' | 'report' | 'manual' | 'certificate' 
  | 'plan' | 'video' | 'audio' | 'other';

export type TMediaType = 
  | 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';

export type TOperationStatus = 
  | 'CREATED' | 'IN_PROGRESS' | 'PENDING_VALIDATION' | 'APPROVED' 
  | 'REJECTED' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';

export type TPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type TOperationCategory = 
  | 'RENTAL' | 'MAINTENANCE' | 'ACADEMIC' | 'ADMINISTRATIVE' 
  | 'FINANCIAL' | 'HR' | 'PARTNERSHIP' | 'SECURITY' | 'OTHER';

export type TNotificationType = 
  | 'info' | 'warning' | 'error' | 'success' | 'critical';

export type TOperationNotificationType = 
  | 'ASSIGNED' | 'STATUS_CHANGE' | 'DUE_SOON' | 'OVERDUE' 
  | 'COMMENT_ADDED' | 'APPROVAL_REQUIRED';

// Interfaces principales
export interface IAttachment 
{
	id: string;
	title: string;
	description?: string;
	file: string;
	file_url?: string;
	thumbnail_url?: string;
	large_url?: string;
	file_extension?: string;
	file_size_formatted?: string;
	media_type: TMediaType;
	media_type_display?: string;
	attachment_type: TAttachmentType;
	attachment_type_display?: string;
	is_required: boolean;
	is_confidential: boolean;
	tags?: string;
	tags_list?: string[];
	sort_order?: number;
	related_operation?: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface IOperationComment 
{
	id: string;
	operation: string;
	author: string;
	author_details: IOperationsUser;
	content: string;
	is_internal: boolean;
	parent_comment?: string;
	parent_comment_details?: string;
	attachments: string[];
	replies_count?: number;
	is_reply?: boolean;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface IHistoryLog 
{
	id: string;
	operation: string;
	user?: string;
	user_details?: IOperationsUser;
	affected_user?: string;
	affected_user_details?: IOperationsUser;
	action_type: string;
	action_type_display?: string;
	description: string;
	formatted_description?: string;
	previous_status?: string;
	new_status?: string;
	duration_hours?: number;
	cost_amount?: number;
	metadata?: Record<string, any>;
	ip_address?: string;
	user_agent?: string;
	created_at: string;
}

export interface IOperationNotification 
{
	id: string;
	operation: string;
	operation_details?: string;
	recipient: string;
	recipient_details: IOperationsUser;
	title: string;
	message: string;
	notification_type?: TNotificationType;
	notification_type_display?: string;
	operation_notification_type: TOperationNotificationType;
	operation_notification_type_display?: string;
	context_data?: Record<string, any>;
	is_read: boolean;
	read_at?: string;
	operation_title?: string;
	operation_status?: string;
	created_at: string;
	updated_at: string;
}

export interface IOperationList 
{
	id: string;
	operation_number: string;
	operation_type: string;
	operation_type_name?: string;
	title: string;
	status: TOperationStatus;
	status_display?: string;
	priority: TPriority;
	priority_display?: string;
	requester: string;
	requester_name?: string;
	assigned_to?: string;
	assigned_to_name?: string;
	due_date?: string;
	is_overdue?: boolean;
	days_until_due?: number;
	is_high_priority?: boolean;
	completion_percentage?: number;
	created_at: string;
	updated_at: string;
}

export interface IOperationDetail extends IOperationList 
{
	operation_type_details: IOperationType;
	description: string;
	requester_details: IOperationsUser;
	assigned_to_details?: IOperationsUser;
	supervisor?: string;
	supervisor_details?: IOperationsUser;
	related_content_type?: number;
	related_object_id?: string;
	started_at?: string;
	completed_at?: string;
	tags?: string[];
	metadata?: Record<string, any>;
	estimated_duration_hours?: number;
	actual_duration_hours?: number;
	comments: IOperationComment[];
	history_logs: IHistoryLog[];
	comments_count?: number;
	attachments_count?: number;
	managed_unit_details?: string; // Unit UUID
	operation_category: string;
}

export interface IOperationType 
{
	id: string;
	name: string;
	code: string;
	category: TOperationCategory;
	category_display?: string;
	description?: string;
	requires_approval: boolean;
	auto_assign_rules?: Record<string, any>;
	default_priority: TPriority;
	sla_hours?: number;
	color_code: string;
	icon_name: string;
	is_high_priority_default?: boolean;
	operations_count?: number;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface IOperationsUser 
{
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	full_name: string;
}

// Interfaces pour les filtres
export interface IAttachmentFilters 
{
	attachment_type?: TAttachmentType;
	media_type?: TMediaType;
	is_required?: boolean;
	is_confidential?: boolean;
	is_active?: boolean;
	search?: string;
	ordering?: string;
}

export interface IOperationFilters 
{
	operation_type?: string;
	status?: TOperationStatus;
	priority?: TPriority;
	requester?: string;
	assigned_to?: string;
	supervisor?: string;
	is_active?: boolean;
	search?: string;
	ordering?: string;
}

export interface ICommentFilters 
{
	operation?: string;
	author?: string;
	is_internal?: boolean;
	parent_comment?: string;
	is_active?: boolean;
	search?: string;
	ordering?: string;
}

export interface IPaginatedResponse<T> 
{
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface IOperationType 
{
    id: string;
    name: string;
    code: string;
    category?: TOperationCategory;
    category_display?: string;
    description?: string;
    requires_approval: boolean;
    auto_assign_rules?: Record<string, any>;
    default_priority: TPriority;
    sla_hours?: number;
    color_code: string;
    icon_name: string;
    default_icon?: string;
    default_icon_details?: IOperationsMediaFile;
    is_high_priority_default?: boolean;
    operations_count?: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface IOperationsMediaFile 
{
    id: string;
    title?: string;
    description?: string;
    media_type: TMediaType;
    file_url: string;
    thumbnail_url?: string;
    file_size?: string;
    mime_type?: string;
    created_at: string;
}

export interface IOperationCategory {
    id: string;
    code: string;
    name: string;
    description?: string;
    color_code?: string;
    icon_name?: string;
    sort_order?: number;
    is_active: boolean;
    operation_types_count?: number;
    created_at: string;
    updated_at: string;
}