import { useMemo, useState } from 'react';
import { Send, Building2, DoorOpen, Layers } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOperationCategories } from '@/hooks/useOperations';
import { IOperationCategory, ICreateOperationPayload } from '@/types/operations.type';
import { useBuildingHierarchy, useBuildings, useUnits } from '@/hooks/usePatrimoine';
import { IBuilding, IFloor, IUnit } from '@/types/patrimoine.type';
import OperationService from '@/services/operations';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { getUserRoom } from '@/lib/user';
import FileUploader, { IUploadedFile } from '../common/FileUploader';


export default function NewReportForm()
{
	// ==========================================
	// 				 FORM DATA 
	// ==========================================
	const [isCommon, setIsCommon] = useState(true);
	const [category, setCategory] = useState<string>('');
	const [selectedBuilding, setSelectedBuilding] = useState<string>('');
	const [selectedFloor, setSelectedFloor] = useState<string>('');
	const [selectedUnit, setSelectedUnit] = useState<string>('');
    const [files, setFiles] = useState<IUploadedFile[]>([]);
	const [operationData, setOperationData] = useState<ICreateOperationPayload>({
		operation_type_code: 'RENTAL_COMPLAINT',  
		title: '',
		description: '',
		priority: 'NORMAL',
		managed_unit: null,
	});
    const [showSuccess, setShowSuccess] = useState<boolean>(false);



	// ==========================================
	// 				 SERVICE DATA
	// ==========================================
	const { user } = useAuth();
	const { buildingsList, isLoading } = useBuildings();
	const { floorsList, unitsList, isLoading: hierarchyIsLoading } = useBuildingHierarchy((isCommon && selectedBuilding) ? selectedBuilding : '');
	// const { profile: tenantProfile } = useMyTenantProfile();
	const unitsFilters = useMemo(() => ({
		search: !isCommon ? getUserRoom(user?.email || "") : ""
	}), [isCommon, user?.email]);
	const { units: myUnitMap } = useUnits(unitsFilters);
	const { operationCategoriesList } = useOperationCategories();
	const navigate = useNavigate();
	const { toast } = useToast();
	
	

	// ==========================================
	// 				 FORM HANDLERS
	// ==========================================

	const handleInputChange = (name: string, value: string) => {
		setOperationData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleCommonChange = (value: boolean) => {
		setIsCommon(value);
		// handleUnitChange(user_room);
	}

	const handleCategoryChange = (value: string) => {
		setCategory(value);
		handleInputChange('operation_type_code', value);
	}
	
	const handleBuildingChange = (value: string) => {
		setSelectedBuilding(value);
		setSelectedFloor('');
		setSelectedUnit('');
	};
	
	const handleFloorChange = (value: string) => {
		setSelectedFloor(value);
		setSelectedUnit('');
	};
	
	const handleUnitChange = (value: string) => {
		setSelectedUnit(value);
		handleInputChange('managed_unit', value);
	}

	const handleSubmit = async () => {
		if (!operationData.title || !operationData.description) {
			toast({
				variant: 'destructive',
				duration: 3000,
				title: 'Aïe...',
				description: 'Tu peux remplir tous les champs obligatoires s\'il te plait ? On en a besoin nous 😅.'
			});
			return;
		}

		if (isCommon && !operationData.managed_unit) {
			toast({
				variant: 'destructive',
				duration: 3000,
				title: 'Aïe...',
				description: 'Tu peux remplir tous les champs obligatoires s\'il te plait ? On en a besoin nous 😅.'
			});
			return;
		}

		const payload = operationData;
		
		if (!isCommon && myUnitMap.size !== 0) {
			const myUnit = myUnitMap.values().next().value;
			payload.managed_unit = myUnit.id;
		}
		
		try {
			const operation = await OperationService.createOperation(payload);
			
			if (files.length > 0) {
				try {
					const uploadedFiles = files.map(u => u.file);
					await OperationService.uploadOperationPhotos( operation.id, uploadedFiles, 'photo_evidence' );

				} catch (error) {
					toast({
						variant: 'destructive',
						duration: 3000,
						title: 'On a un problème...',
						description: "L'application n'arrive pas à uploader certaines files."
					});
				}
			}
			
			// Reset form
			setOperationData({
				operation_type_code: 'RENTAL_COMPLAINT',
				title: '',
				description: '',
				priority: 'NORMAL',
				managed_unit: null,
			});
			setFiles([]);
			setCategory('');
			setSelectedBuilding('');
			setSelectedFloor('');
			setSelectedUnit('');
			
			
			// Show error message
			setShowSuccess(true);
			setTimeout(() => {
				setShowSuccess(false);

				toast({
					variant: 'default',
					duration: 3000,
					description: 'On a bien reçu ton signalement. Merci.'
				});
				navigate('/reports');
			}, 3000);
		} catch (error) {
			toast({
				variant: 'destructive',
				duration: 3000,
				title: 'Whoops...',
				description: 'On a des problèmes avec le serveur. Tu peux réessayer plus tard ?'
			});
		}
	};

    // ==========================================
	// 				 	RENDER
	// ==========================================
	const isLoadingState = isLoading || (isCommon && selectedBuilding && hierarchyIsLoading);
	if (isLoadingState) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Une minute s'il te plait !</p>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Common Field */}
			<div className="flex items-center space-x-2 p-4 bg-primary/5 rounded-lg">
				<Checkbox
					id="common"
					checked={isCommon}
					onCheckedChange={handleCommonChange}
				/>
				<Label
					htmlFor="common"
					className="text-gray-300 font-medium cursor-pointer"
				>
					{isCommon ? "Il s'agit d'un bien commun" : "Il s'agit de ma chambre"}
				</Label>
			</div>

			{/* Category */}
			<div className="space-y-2">
				<Label htmlFor="category" className="text-gray-300">
					Catégorie <span className="text-red-500">*</span>
				</Label>
				<Select
					value={category}
					onValueChange={handleCategoryChange}
				>
					<SelectTrigger id="category" className="w-full h-12 bg-[#2f2014] border border-white/10 rounded-full p-4 text-white placeholder:text-white-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all">
						<SelectValue placeholder="Sélectionner une catégorie" />
					</SelectTrigger>
					<SelectContent className="w-full bg-[#2f2014] border border-white/10 rounded-xl p-4 text-white placeholder:text-white-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all">
						{operationCategoriesList.map((category: IOperationCategory) => (
							<SelectItem key={category.id} value={`SIG-${category.code}`} className="text-white">
								{category.name[0]}{category.name.toLowerCase().slice(1, category.name.length)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Unit id (only for common operations) */}
			{isCommon && (
				<div className="space-y-2">
					{/* Building */}
					<div className="space-y-2">
						<Label htmlFor="building" className="text-base font-semibold flex items-center gap-2 text-gray-300">
							<Building2 className="w-4 h-4 text-indigo-600" />
							Bâtiment <span className="text-red-500">*</span>
						</Label>
						<Select
							value={selectedBuilding}
							onValueChange={handleBuildingChange}
						>
							<SelectTrigger id="building" className="w-full h-12 bg-[#2f2014] border border-white/10 rounded-full p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all">
								<SelectValue placeholder="Sélectionner un bâtiment" />
							</SelectTrigger>
							<SelectContent className="w-full bg-[#2f2014] border border-white/10 rounded-xl p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all">
								{buildingsList.map((building: IBuilding, index: number) => (
									<SelectItem key={`${building.id}-${index}`} value={building.id} className="text-white">
											{building.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Floor */}
					<div className="space-y-2">
						<Label
							htmlFor="floor"
							className={`text-gray-300 text-base font-semibold flex items-center gap-2 ${!selectedBuilding ? 'opacity-50' : ''
								}`}
						>
							<Layers className="w-4 h-4 text-purple-600" />
							Étage <span className="text-red-500">*</span>
						</Label>
						<Select
							value={selectedFloor}
							onValueChange={handleFloorChange}
							disabled={!selectedBuilding}
						>
							<SelectTrigger id="floor" className="w-full h-12 bg-[#2f2014] border border-white/10 rounded-full p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all">
								<SelectValue placeholder={
									selectedBuilding
										? "Sélectionner un étage"
										: "Sélectionner d'abord un bâtiment"
								} />
							</SelectTrigger>
							<SelectContent className="w-full bg-[#2f2014] border border-white/10 rounded-xl p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all">
								{floorsList.map((floor: IFloor, index: number) => (
									<SelectItem key={`${floor.id}${index}`} value={`${index === 0 ? "RDC" : `Etage ${index}`}`} className="text-white">
										{index === 0 ? 'Rez-de-chaussée' : `Etage ${index}`}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Unit */}
					<div className="space-y-2">
						<Label
							htmlFor="unit"
							className={`text-gray-300 text-base font-semibold flex items-center gap-2 ${!selectedFloor ? 'opacity-50' : ''
								}`}
						>
							<DoorOpen className="w-4 h-4 text-pink-600" />
							Unité concernée <span className="text-red-500">*</span>
						</Label>
						<Select
							value={selectedUnit}
							onValueChange={handleUnitChange}
							disabled={!selectedFloor}
						>
							<SelectTrigger id="unit" className="w-full h-12 bg-[#2f2014] border border-white/10 rounded-full p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all">
								<SelectValue placeholder={
									selectedFloor
										? "Sélectionner une unité"
										: "Sélectionner d'abord un étage"
								} />
							</SelectTrigger>
							<SelectContent className="w-full bg-[#2f2014] border border-white/10 rounded-xl p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all">
								{unitsList.map((unit: IUnit, index: number) => 
								
												(unit.name && !unit.name.includes('Chambre') && unit.name.includes(selectedFloor)) && 
								(
									<SelectItem key={`${unit.id}${index}`} value={unit.id} className="text-white">
										{unit.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			)}

			{/* Report title */}
			<div className="space-y-2">
				<Label htmlFor="titre" className="text-gray-300">
					Titre du signalement <span className="text-red-500">*</span>
				</Label>
				<Input
					id="titre"
					type="text"
					placeholder="Résumé du problème"
					value={operationData.title}
					onChange={(e) => handleInputChange('title', e.target.value)}
					className="w-full h-12 bg-[#2f2014] border border-white/10 rounded-full p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
				/>
			</div>

			{/* Report Description */}
			<div className="space-y-2">
				<Label htmlFor="description" className="text-gray-300">
					Description <span className="text-red-500">*</span>
				</Label>
				<Textarea
					id="description"
					placeholder="Décrivez le problème en détail..."
					rows={5}
					value={operationData.description}
					onChange={(e) => handleInputChange('description', e.target.value)}
					className="w-full bg-[#2f2014] border border-white/10 rounded-2xl p-4 text-white placeholder:text-white-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
				/>
			</div>

            {/* Photos */}
            <FileUploader 
                label="Photos"
                description="Cliquez pour ajouter des photos"
                subDescription="Plusieurs fichiers acceptés (JPG, PNG, etc.)"
                acceptedFileType="image/*"
                maxSize={4}
                files={files}
                onFilesChange={setFiles}
            />

			{/* Submit button */}
            <Button
                onClick={handleSubmit}
                size="lg"
                className="w-full shadow-primary/30 shadow-md rounded-full"
            >
                <Send className="mr-2 h-4 w-4" />
                Soumettre le signalement
            </Button>
		</>
	);
}