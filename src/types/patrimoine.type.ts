export interface IPaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// Building types
export interface IBuilding {
    id: string;
    name: string;
    code?: string;
    address?: string;
    main_image?: string;
    main_image_details?: IPatrimoineMediaFile;
    main_image_url?: string;
    main_image_thumbnail_url?: string;
    total_area_m2?: number;
    floors_count?: number;
    floors_count_actual?: number;
    units_count?: number;
    construction_year?: number;
    manager?: string;
    manager_name?: string;
    is_active: boolean;
}

// Floor types
export interface IFloor {
    id: string;
    building: string;
    building_name?: string;
    number: number;
    chemical_code: string;
    name?: string;
    full_name?: string;
    area_m2?: number;
    floor_plan?: string;
    floor_plan_details?: IPatrimoineMediaFile;
    floor_plan_url?: string;
    plan_url?: string;
    units_count?: number;
    is_active: boolean;
}

// Unit types
export interface IUnit {
    id: string;
    floor: string;
    building_name?: string;
    floor_code?: string;
    unit_type: string;
    unit_type_name?: string;
    parent?: string;
    identifier: string;
    name?: string;
    full_name?: string;
    main_image_url?: string;
    main_image_thumbnail_url?: string;
    area_m2?: number;
    current_status: TUnitStatus;
    monthly_rent?: number;
    monthly_charges?: number;
    total_monthly_cost?: number;
    current_occupant?: string;
    occupant_name?: string;
    occupation_start_date?: string;
    is_active: boolean;
}

// Media file types
export interface IPatrimoineMediaFile {
    id: string;
    title?: string;
    description?: string;
    media_type: string;
    file_url: string;
    thumbnail_url?: string;
    file_size?: string;
    mime_type?: string;
    created_at: string;
}

// Unit status types
export type TUnitStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE' | 'OUT_OF_SERVICE';

// Statistics types
export interface IBuildingStatistics {
    total_area_m2: number;
    floors_count: number;
    units_count: number;
    available_units: number;
    occupied_units: number;
}

// Inventory types
export type TInventoryCategory =
    | 'FURNITURE' | 'APPLIANCE' | 'PLUMBING' | 'LIGHTING'
    | 'HEATING' | 'IT' | 'SECURITY' | 'DECORATION' | 'OTHER';

export interface IInventoryItem {
    id: string;
    name: string;
    category: TInventoryCategory;
    category_display: string;
    brand?: string;
    model?: string;
    reference: string;
    description?: string;
    stock_quantity: number;
    unit_price?: string;
    technical_specs?: Record<string, any>;
    notes?: string;
    images: string[];
    images_details: IPatrimoineMediaFile[];
    main_image?: string;
    main_image_url?: string;
    main_image_thumbnail_url?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface IInventoryItemWrite {
    name: string;
    category: TInventoryCategory;
    brand?: string;
    model?: string;
    description?: string;
    stock_quantity?: number;
    unit_price?: string;
    technical_specs?: Record<string, any>;
    notes?: string;
    images?: string[];
    is_active?: boolean;
}
