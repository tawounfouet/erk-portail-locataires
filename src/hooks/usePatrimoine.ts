import { useState, useEffect, useCallback } from 'react';
import PatrimoineService from '@/services/patrimoine';
import { IBuilding, IFloor, IUnit, TUnitStatus } from '@/types/patrimoine.type';

// =========================================================================
// MAIN PATRIMOINE HOOK
// =========================================================================

interface IUsePatrimoineProps {
    // Building filters
    buildingManager?: string;
    buildingIsActive?: boolean;

    // Floor filters
    floorBuilding?: string;
    floorIsActive?: boolean;

    // Unit filters
    unitFloor?: string;
    unitBuilding?: string;
    unitType?: string;
    unitStatus?: TUnitStatus;
    unitIsActive?: boolean;

    // Common
    search?: string;
    ordering?: string;
    page?: number;
    autoFetch?: boolean;
}

interface UsePatrimoineReturn {
  // Data
  buildings: Map<string, IBuilding>;
  buildingsList: IBuilding[];
  floors: Map<string, IFloor>;
  floorsList: IFloor[];
  units: Map<string, IUnit>;
  unitsList: IUnit[];
  
  // Selected items
  selectedBuilding: IBuilding | null;
  selectedFloor: IFloor | null;
  selectedUnit: IUnit | null;
  
  // Pagination
  pagination: {
    buildings: PaginationInfo;
    floors: PaginationInfo;
    units: PaginationInfo;
  };
  
  // State
  isLoading: {
    buildings: boolean;
    floors: boolean;
    units: boolean;
  };
  isError: {
    buildings: boolean;
    floors: boolean;
    units: boolean;
  };
  error: {
    buildings: string | null;
    floors: string | null;
    units: string | null;
  };
  
  // Actions
  fetchBuildings: (page?: number) => Promise<void>;
  fetchFloors: (page?: number) => Promise<void>;
  fetchUnits: (page?: number) => Promise<void>;
  refetchAll: () => Promise<void>;
  
  // Selection
  selectBuilding: (building: IBuilding | null) => void;
  selectFloor: (floor: IFloor | null) => void;
  selectUnit: (unit: IUnit | null) => void;
  
  // Filters
  setFilters: (filters: Partial<IUsePatrimoineProps>) => void;
  setSearch: (search: string) => void;
  setBuildingManager: (manager: string | undefined) => void;
  setUnitStatus: (status: TUnitStatus | undefined) => void;
}

interface PaginationInfo {
  count: number;
  next: string | null;
  previous: string | null;
  page: number;
}

/**
 * Main hook for managing all patrimoine data (buildings, floors, units)
 */
export const usePatrimoine = (initialProps: IUsePatrimoineProps = {}): UsePatrimoineReturn => {
    const {
        buildingManager,
        buildingIsActive = true,
        floorBuilding,
        floorIsActive = true,
        unitFloor,
        unitBuilding,
        unitType,
        unitStatus,
        unitIsActive = true,
        search,
        ordering = 'name',
        page = 1,
        autoFetch = true
    } = initialProps;

    // Data states
    const [buildings, setBuildings] = useState<Map<string, IBuilding>>(new Map());
    const [floors, setFloors] = useState<Map<string, IFloor>>(new Map());
    const [units, setUnits] = useState<Map<string, IUnit>>(new Map());
    
    // Selected items
    const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>(null);
    const [selectedFloor, setSelectedFloor] = useState<IFloor | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<IUnit | null>(null);
    
    // Loading states
    const [isLoading, setIsLoading] = useState({
        buildings: false,
        floors: false,
        units: false
    });
    
    // Error states
    const [isError, setIsError] = useState({
        buildings: false,
        floors: false,
        units: false
    });
    
    const [error, setError] = useState({
        buildings: null as string | null,
        floors: null as string | null,
        units: null as string | null
    });

    // Pagination
    const [pagination, setPagination] = useState({
        buildings: { count: 0, next: null, previous: null, page: 1 },
        floors: { count: 0, next: null, previous: null, page: 1 },
        units: { count: 0, next: null, previous: null, page: 1 }
    });

    // Filters
    const [filters, setFilters] = useState<IUsePatrimoineProps>({
        buildingManager,
        buildingIsActive,
        floorBuilding,
        floorIsActive,
        unitFloor,
        unitBuilding,
        unitType,
        unitStatus,
        unitIsActive,
        search,
        ordering,
        page
    });

    /**
     * Fetch buildings with current filters
     */
    const fetchBuildings = useCallback(async (page: number = 1) => {
        setIsLoading(prev => ({ ...prev, buildings: true }));
        setIsError(prev => ({ ...prev, buildings: false }));
        setError(prev => ({ ...prev, buildings: null }));

        try {
            const response = await PatrimoineService.getBuildings({
                manager: filters.buildingManager,
                is_active: filters.buildingIsActive,
                search: filters.search,
                ordering: filters.ordering,
                page
            });

            const buildingsMap = new Map<string, IBuilding>();
            response.results.forEach(building => {
                buildingsMap.set(building.id, building);
            });

            setBuildings(buildingsMap);
            setPagination(prev => ({
                ...prev,
                buildings: {
                    count: response.count,
                    next: response.next,
                    previous: response.previous,
                    page
                }
            }));

        } catch (err) {
            setIsError(prev => ({ ...prev, buildings: true }));
            setError(prev => ({ ...prev, buildings: err instanceof Error ? err.message : 'Erreur lors du chargement des bâtiments' }));
            console.error('Error fetching buildings:', err);
        } finally {
            setIsLoading(prev => ({ ...prev, buildings: false }));
        }
    }, [filters]);

    /**
     * Fetch floors with current filters
     */
    const fetchFloors = useCallback(async (page: number = 1) => {
        setIsLoading(prev => ({ ...prev, floors: true }));
        setIsError(prev => ({ ...prev, floors: false }));
        setError(prev => ({ ...prev, floors: null }));

        try {
            const response = await PatrimoineService.getFloors({
                building: filters.floorBuilding,
                is_active: filters.floorIsActive,
                search: filters.search,
                ordering: filters.ordering,
                page
            });

            const floorsMap = new Map<string, IFloor>();
            response.results.forEach(floor => {
                floorsMap.set(floor.id, floor);
            });

            setFloors(floorsMap);
            setPagination(prev => ({
                ...prev,
                floors: {
                    count: response.count,
                    next: response.next,
                    previous: response.previous,
                    page
                }
            }));

        } catch (err) {
            setIsError(prev => ({ ...prev, floors: true }));
            setError(prev => ({ ...prev, floors: err instanceof Error ? err.message : 'Erreur lors du chargement des étages' }));
            console.error('Error fetching floors:', err);
        } finally {
            setIsLoading(prev => ({ ...prev, floors: false }));
        }
    }, [filters]);

    /**
     * Fetch units with current filters
     */
    const fetchUnits = useCallback(async (page: number = 1) => {
        setIsLoading(prev => ({ ...prev, units: true }));
        setIsError(prev => ({ ...prev, units: false }));
        setError(prev => ({ ...prev, units: null }));

        try {
            const response = await PatrimoineService.getUnits({
                floor: filters.unitFloor,
                floor__building: filters.unitBuilding,
                unit_type: filters.unitType,
                current_status: filters.unitStatus,
                is_active: filters.unitIsActive,
                search: filters.search,
                ordering: filters.ordering,
                page
            });

            const unitsMap = new Map<string, IUnit>();
            response.results.forEach(unit => {
                unitsMap.set(unit.id, unit);
            });

            setUnits(unitsMap);
            setPagination(prev => ({
                ...prev,
                units: {
                count: response.count,
                next: response.next,
                previous: response.previous,
                page
                }
            }));

        } catch (err) {
            setIsError(prev => ({ ...prev, units: true }));
            setError(prev => ({ ...prev, units: err instanceof Error ? err.message : 'Erreur lors du chargement des unités' }));
            console.error('Error fetching units:', err);
        } finally {
            setIsLoading(prev => ({ ...prev, units: false }));
        }
    }, [filters]);

    /**
     * Update filters and refetch data
     */
    const updateFilters = useCallback((newFilters: Partial<IUsePatrimoineProps>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    /**
     * Set search term
     */
    const setSearch = useCallback((searchTerm: string) => {
        setFilters(prev => ({ ...prev, search: searchTerm }));
    }, []);

    /**
     * Set building manager filter
     */
    const setBuildingManager = useCallback((manager: string | undefined) => {
        setFilters(prev => ({ ...prev, buildingManager: manager }));
    }, []);

    /**
     * Set unit status filter
     */
    const setUnitStatus = useCallback((status: TUnitStatus | undefined) => {
        setFilters(prev => ({ ...prev, unitStatus: status }));
    }, []);

    /**
     * Refetch all data
     */
    const refetchAll = useCallback(async () => {
        await Promise.all([
        fetchBuildings(pagination.buildings.page),
        fetchFloors(pagination.floors.page),
        fetchUnits(pagination.units.page)
        ]);
    }, [fetchBuildings, fetchFloors, fetchUnits, pagination]);

    // Auto-fetch on mount and when filters change
    useEffect(() => {
        if (autoFetch) {
        fetchBuildings(1);
        fetchFloors(1);
        fetchUnits(1);
        }
    }, [filters, autoFetch, fetchBuildings, fetchFloors, fetchUnits]);

    return {
        // Data
        buildings,
        buildingsList: Array.from(buildings.values()),
        floors,
        floorsList: Array.from(floors.values()),
        units,
        unitsList: Array.from(units.values()),
        
        // Selected items
        selectedBuilding,
        selectedFloor,
        selectedUnit,
        
        // Pagination
        pagination,
        
        // State
        isLoading,
        isError,
        error,
        
        // Actions
        fetchBuildings,
        fetchFloors,
        fetchUnits,
        refetchAll,
        
        // Selection
        selectBuilding: setSelectedBuilding,
        selectFloor: setSelectedFloor,
        selectUnit: setSelectedUnit,
        
        // Filters
        setFilters: updateFilters,
        setSearch,
        setBuildingManager,
        setUnitStatus
    };
};

// =========================================================================
// SPECIALIZED HOOKS
// =========================================================================

/**
 * Hook for buildings only
 */
export const useBuildings = (filters?: {
  manager?: string;
  is_active?: boolean;
  search?: string;
  ordering?: string;
  autoFetch?: boolean;
}) => {
  const [buildings, setBuildings] = useState<Map<string, IBuilding>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    count: 0, next: null, previous: null, page: 1
  });

const fetchBuildings = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
        const response = await PatrimoineService.getBuildings({
        ...filters,
        page
        });

        const buildingsMap = new Map<string, IBuilding>();
        response.results.forEach(building => {
        buildingsMap.set(building.id, building);
        });

        setBuildings(buildingsMap);
        setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous,
        page
        });

    } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des bâtiments');
        console.error('Error fetching buildings:', err);
    } finally {
        setIsLoading(false);
    }
  }, [filters]);

    useEffect(() => {
        if (filters?.autoFetch !== false) 
        {
            fetchBuildings(1);
        }
    }, [filters, fetchBuildings]);

  return {
    buildings,
    buildingsList: Array.from(buildings.values()),
    isLoading,
    isError,
    error,
    pagination,
    fetchBuildings,
    refetch: () => fetchBuildings(pagination.page)
  };
};

/**
 * Hook for floors only
 */
export const useFloors = (filters?: {
  building?: string;
  is_active?: boolean;
  search?: string;
  ordering?: string;
  autoFetch?: boolean;
}) => {
    const [floors, setFloors] = useState<Map<string, IFloor>>(new Map());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo>({
        count: 0, next: null, previous: null, page: 1
    });

    const fetchFloors = useCallback(async (page: number = 1) => {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        try {
            const response = await PatrimoineService.getFloors({
                ...filters,
                page
            });

            const floorsMap = new Map<string, IFloor>();
            response.results.forEach(floor => {
                floorsMap.set(floor.id, floor);
            });

            setFloors(floorsMap);
            setPagination({
                count: response.count,
                next: response.next,
                previous: response.previous,
                page
            });

        } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des étages');
        console.error('Error fetching floors:', err);
        } finally {
        setIsLoading(false);
        }
    }, [filters]);

  useEffect(() => {
    if (filters?.autoFetch !== false) {
      fetchFloors(1);
    }
  }, [filters, fetchFloors]);

  return {
    floors,
    floorsList: Array.from(floors.values()),
    isLoading,
    isError,
    error,
    pagination,
    fetchFloors,
    refetch: () => fetchFloors(pagination.page)
  };
};

/**
 * Hook for units only
 */
export const useUnits = (filters?: {
  floor?: string;
  floor__building?: string;
  unit_type?: string;
  current_status?: TUnitStatus;
  is_active?: boolean;
  search?: string;
  ordering?: string;
  autoFetch?: boolean;
}) => {
    const [units, setUnits] = useState<Map<string, IUnit>>(new Map());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo>({
    count: 0, next: null, previous: null, page: 1
    });

    const fetchUnits = useCallback(async (page: number = 1) => {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        try {
            const response = await PatrimoineService.getUnits({
                ...filters,
                page
            });

            const unitsMap = new Map<string, IUnit>();
            response.results.forEach(unit => {
                unitsMap.set(unit.id, unit);
            });

            setUnits(unitsMap);
            setPagination({
                count: response.count,
                next: response.next,
                previous: response.previous,
                page
            });

        } catch (err) {
            setIsError(true);
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des unités');
            console.error('Error fetching units:', err);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        if (filters?.autoFetch !== false) 
        {
            fetchUnits(1);
        }
    }, [filters, fetchUnits]);

    return {
        units,
        unitsList: Array.from(units.values()),
        isLoading,
        isError,
        error,
        pagination,
        fetchUnits,
        refetch: () => fetchUnits(pagination.page)
    };
};

/**
 * Hook for building hierarchy (building -> floors -> units)
 */
export const useBuildingHierarchy = (buildingId?: string) => {
    const [hierarchy, setHierarchy] = useState<{
        building: IBuilding | null;
        floors: Map<string, IFloor>;
        units: Map<string, IUnit>;
    }>({
        building: null,
        floors: new Map(),
        units: new Map()
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHierarchy = useCallback(async (id: string) => {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        try {
            const [building, floors, units] = await Promise.all([
                PatrimoineService.getBuildingById(id),
                PatrimoineService.getFloorsByBuilding(id),
                PatrimoineService.getUnitsByBuilding(id)
            ]);

            const floorsMap = new Map<string, IFloor>();
                floors.results.forEach(floor => {
                floorsMap.set(floor.id, floor);
            });

            const unitsMap = new Map<string, IUnit>();
                units.results.forEach(unit => {
                unitsMap.set(unit.id, unit);
            });

            setHierarchy({
                building,
                floors: floorsMap,
                units: unitsMap
            });

        } catch (err) {
            setIsError(true);
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la hiérarchie');
            console.error('Error fetching building hierarchy:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (buildingId) {
            fetchHierarchy(buildingId);
        } else {
            setHierarchy({ building: null, floors: new Map(), units: new Map() });
        }
    }, [buildingId, fetchHierarchy]);

    return {
        ...hierarchy,
        floorsList: Array.from(hierarchy.floors.values()),
        unitsList: Array.from(hierarchy.units.values()),
        isLoading,
        isError,
        error,
        refetch: () => buildingId ? fetchHierarchy(buildingId) : Promise.resolve()
    };
};
