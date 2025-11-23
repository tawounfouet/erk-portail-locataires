import { IBuilding, IBuildingStatistics, IFloor, IPaginatedResponse, IUnit, TUnitStatus } from "@/types/patrimoine.type";
import AuthService from "./auth";
import { ERK_API_URL } from "@/static/dev.static";

/**
 * Patrimoine service for managing buildings, floors and units
 * Provides CRUD operations and statistics for real estate assets
 */
export default class PatrimoineService 
{
    // Base URLs for the patrimoine API endpoints
    private static readonly BASE_URL: string = ERK_API_URL;
    private static readonly BUILDINGS_URL: string = "/patrimoine/buildings/";
    private static readonly FLOORS_URL: string = "/patrimoine/floors/";
    private static readonly UNITS_URL: string = "/patrimoine/units/";

    /**
     * Generic request method for all API calls with error handling
     */
    private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
            
            if (!response.ok) {
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
                        console.error('Authentication error:', error);
                        throw new Error('Session expired, please reconnect');
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

    // =========================================================================
    // BUILDINGS MANAGEMENT
    // =========================================================================

    /**
     * Retrieves all buildings with optional filtering and pagination
     * @param filters - Filtering options for buildings
     * @returns Paginated list of buildings
     */
    static async getBuildings(filters: {
        manager?: string;
        is_active?: boolean;
        search?: string;
        ordering?: string;
        page?: number;
    } = {}): Promise<IPaginatedResponse<IBuilding>> {
        const params = new URLSearchParams();
        
        if (filters?.manager) params.append('manager', filters.manager);
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.ordering) params.append('ordering', filters.ordering);
        if (filters?.page) params.append('page', filters.page.toString());

        const queryString = params.toString();
        const endpoint = queryString ? `${this.BUILDINGS_URL}?${queryString}` : this.BUILDINGS_URL;

        return this.request<IPaginatedResponse<IBuilding>>(endpoint);
    }

    /**
     * Retrieves a specific building by ID
     * @param id - Building UUID
     * @returns Building details
     */
    static async getBuildingById(id: string): Promise<IBuilding> {
        return this.request<IBuilding>(`${this.BUILDINGS_URL}${id}/`);
    }

    /**
     * Utility method to get all active buildings
     * @returns List of active buildings
     */
    static async getActiveBuildings(): Promise<IPaginatedResponse<IBuilding>> {
        return this.getBuildings({ is_active: true });
    }

    // =========================================================================
    // FLOORS MANAGEMENT
    // =========================================================================

    /**
     * Retrieves all floors with optional filtering and pagination
     * @param filters - Filtering options for floors
     * @returns Paginated list of floors
     */
    static async getFloors(filters: {
        building?: string;
        is_active?: boolean;
        search?: string;
        ordering?: string;
        page?: number;
    } = {}): Promise<IPaginatedResponse<IFloor>> {
        const params = new URLSearchParams();
        
        if (filters?.building) params.append('building', filters.building);
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.ordering) params.append('ordering', filters.ordering);
        if (filters?.page) params.append('page', filters.page.toString());

        const queryString = params.toString();
        const endpoint = queryString ? `${this.FLOORS_URL}?${queryString}` : this.FLOORS_URL;

        return this.request<IPaginatedResponse<IFloor>>(endpoint);
    }

    /**
     * Retrieves floors for a specific building
     * @param buildingId - Building UUID
     * @returns List of floors in the building
     */
    static async getFloorsByBuilding(buildingId: string): Promise<IPaginatedResponse<IFloor>> {
        return this.getFloors({ building: buildingId, is_active: true });
    }

    /**
     * Retrieves a specific floor by ID
     * @param id - Floor UUID
     * @returns Floor details
     */
    static async getFloorById(id: string): Promise<IFloor> {
        return this.request<IFloor>(`${this.FLOORS_URL}${id}/`);
    }

    // =========================================================================
    // UNITS MANAGEMENT
    // =========================================================================

    /**
     * Retrieves all units with optional filtering and pagination
     * @param filters - Filtering options for units
     * @returns Paginated list of units
     */
    static async getUnits(filters: {
        floor?: string;
        floor__building?: string;
        unit_type?: string;
        parent?: string;
        current_status?: TUnitStatus;
        current_occupant?: string;
        manager?: string;
        is_active?: boolean;
        search?: string;
        ordering?: string;
        page?: number;
    } = {}): Promise<IPaginatedResponse<IUnit>> {
        const params = new URLSearchParams();
        
        if (filters?.floor) params.append('floor', filters.floor);
        if (filters?.floor__building) params.append('floor__building', filters.floor__building);
        if (filters?.unit_type) params.append('unit_type', filters.unit_type);
        if (filters?.parent) params.append('parent', filters.parent);
        if (filters?.current_status) params.append('current_status', filters.current_status);
        if (filters?.current_occupant) params.append('current_occupant', filters.current_occupant);
        if (filters?.manager) params.append('manager', filters.manager);
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.ordering) params.append('ordering', filters.ordering);
        if (filters?.page) params.append('page', filters.page.toString());

        const queryString = params.toString();
        const endpoint = queryString ? `${this.UNITS_URL}?${queryString}` : this.UNITS_URL;

        return this.request<IPaginatedResponse<IUnit>>(endpoint);
    }

    /**
     * Retrieves units for a specific floor
     * @param floorId - Floor UUID
     * @returns List of units on the floor
     */
    static async getUnitsByFloor(floorId: string): Promise<IPaginatedResponse<IUnit>> {
        return this.getUnits({ floor: floorId, is_active: true });
    }

    /**
     * Retrieves units for a specific building
     * @param buildingId - Building UUID
     * @returns List of units in the building
     */
    static async getUnitsByBuilding(buildingId: string): Promise<IPaginatedResponse<IUnit>> {
        return this.getUnits({ floor__building: buildingId, is_active: true });
    }

    /**
     * Retrieves units by status
     * @param status - Unit status filter
     * @returns List of units with the specified status
     */
    static async getUnitsByStatus(status: TUnitStatus): Promise<IPaginatedResponse<IUnit>> {
        return this.getUnits({ current_status: status, is_active: true });
    }

    /**
     * Retrieves available units (not occupied or reserved)
     * @returns List of available units
     */
    static async getAvailableUnits(): Promise<IPaginatedResponse<IUnit>> {
        return this.getUnits({ current_status: 'AVAILABLE', is_active: true });
    }

    /**
     * Retrieves a specific unit by ID
     * @param id - Unit UUID
     * @returns Unit details
     */
    static async getUnitById(id: string): Promise<IUnit> {
        return this.request<IUnit>(`${this.UNITS_URL}${id}/`);
    }

    // =========================================================================
    // STATISTICS AND AGGREGATED DATA
    // =========================================================================

    /**
     * Gets building statistics (total area, units count, etc.)
     * @param buildingId - Building UUID (optional, for specific building)
     * @returns Building statistics
     */
    static async getBuildingStatistics(buildingId?: string): Promise<IBuildingStatistics> {
        // This would typically be a separate endpoint, but we can aggregate from existing data
        if (buildingId) {
            const building = await this.getBuildingById(buildingId);
            const floors = await this.getFloorsByBuilding(buildingId);
            const units = await this.getUnitsByBuilding(buildingId);
            
            return {
                total_area_m2: building.total_area_m2 || 0,
                floors_count: building.floors_count || 0,
                units_count: building.units_count || 0,
                available_units: units.results.filter(unit => unit.current_status === 'AVAILABLE').length,
                occupied_units: units.results.filter(unit => unit.current_status === 'OCCUPIED').length
            };
        } else {
            // Global statistics across all buildings
            const buildings = await this.getActiveBuildings();
            const units = await this.getUnits({ is_active: true });
            
            return {
                total_area_m2: buildings.results.reduce((sum, building) => sum + (building.total_area_m2 || 0), 0),
                floors_count: buildings.results.reduce((sum, building) => sum + (building.floors_count || 0), 0),
                units_count: buildings.results.reduce((sum, building) => sum + (building.units_count || 0), 0),
                available_units: units.results.filter(unit => unit.current_status === 'AVAILABLE').length,
                occupied_units: units.results.filter(unit => unit.current_status === 'OCCUPIED').length
            };
        }
    }
}