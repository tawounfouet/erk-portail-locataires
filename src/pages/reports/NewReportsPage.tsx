import { useState } from 'react';
import { AlertCircle, Upload, X, Send, Building2, DoorOpen, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOperationCategories } from '@/hooks/useOperations';
import { IOperationCategory, IOperationDetail } from '@/types/operations.type';
import { useBuildingHierarchy, useBuildings } from '@/hooks/usePatrimoine';
import { IBuilding, IFloor, IUnit } from '@/types/patrimoine.type';
import OperationService from '@/services/operations';
import { useAuth } from '@/hooks/useAuth';


export default function NewReportsPage() 
{	
	// ==========================================
	// 				 FORM DATA 
	// ==========================================
	const [category, setCategory] = useState<string>('');
	const [selectedBuilding, setSelectedBuilding] = useState<string>('');
	const [selectedFloor, setSelectedFloor] = useState<string>('');
	const [selectedUnit, setSelectedUnit] = useState<string>('');
	const [photos, setPhotos] = useState([]);
	const [operationData, setOperationData] = useState<Partial<IOperationDetail>>({
		requester: '',
		operation_type: 'SIGNALEMENT',
		managed_unit_details: '',
		title: '',
		description: '',
	});
	const [isCommon, setIsCommon] = useState(true);
	const [showSuccess, setShowSuccess] = useState<boolean>(false);

	// ==========================================
	// 				 SERVICE DATA
	// ==========================================
	// const { operationTypesList: categories } = useOperationTypes();
	const { buildingsList, isLoading } = useBuildings();
	const { user } = useAuth();
	const { floorsList, unitsList, isLoading: hierarchyIsLoading } = useBuildingHierarchy(selectedBuilding);
	const {
		operationCategories,
		operationCategoriesList,
		isError,
		error,
		setSearch
	} = useOperationCategories();


	// ==========================================
	// 				 FORM HANDLERS
	// ==========================================

	const handleInputChange = (name: string, value: string) => {
		setOperationData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handlePhotoUpload = (e) => {
		const files = Array.from(e.target.files);
		const newPhotos = files.map(file => ({
			id: Math.random().toString(36).substr(2, 9),
			name: file.name,
			url: URL.createObjectURL(file),
			file: file
		}));
		setPhotos(prev => [...prev, ...newPhotos]);
	};

	const removePhoto = (id) => {
		setPhotos(prev => prev.filter(photo => photo.id !== id));
	};

	const handleCommonChange = (value: boolean) => {
		setIsCommon(value);
		// handleUnitChange(user_room);
	}

	const handleCategoryChange = (value: string) => {
		setCategory(value);
		handleInputChange('operation_type', "af99f5f2-3b64-42d5-bb62-c858bbc21b9b");
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
		handleInputChange('managed_unit_details', value);
	}

	const handleSubmit = async () => {
		if (!operationData.title || !operationData.description) 
		{
			alert('Veuillez remplir tous les champs obligatoires');
			return;
		}
		
		if (isCommon && !operationData.managed_unit_details) 
		{
			alert('Veuillez renseigner l\'identifiant de la unit');
			return;
		}

		setOperationData(prev => ({
			...prev,
			requester: user.id
		}));
		
		console.log(operationData);

		await OperationService.createOperation(operationData);
	
		// Reset form
		setOperationData({
			requester: user ? user.id : '',
			operation_type: '',
			operation_category: '',
			managed_unit_details: '',
			title: '',
			description: '',
		});

		setPhotos([]);
	};

	// ==========================================
	// 				 	RENDER
	// ==========================================

	if (isLoading || hierarchyIsLoading)
	{
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
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
		<div className="max-w-3xl mx-auto">
			<Card className="shadow-lg">
			<CardHeader>
				<div className="flex items-center gap-3">
				<AlertCircle className="w-8 h-8 text-primary" />
				<div>
					<CardTitle className="text-3xl">Nouveau Signalement</CardTitle>
					<CardDescription className="mt-1">
					Remplissez ce formulaire pour signaler un problème
					</CardDescription>
				</div>
				</div>
			</CardHeader>
			
			<CardContent className="space-y-6">
				{showSuccess && (
					<Alert className="bg-green-50 border-green-200">
						<AlertDescription className="text-green-800">
							Signalement soumis avec succès !
						</AlertDescription>
					</Alert>
				)}

				{/* Common Field */}
				<div className="flex items-center space-x-2 p-4 bg-primary/5 rounded-lg">
					<Checkbox
						id="common"
						checked={isCommon}
						onCheckedChange={handleCommonChange}
					/>
					<Label
						htmlFor="common"
						className="text-base font-medium cursor-pointer"
					>
						Il s'agit d'un bien commun
					</Label>
				</div>

				{/* Category */}
				<div className="space-y-2">
					<Label htmlFor="category">
						Catégorie <span className="text-red-500">*</span>
					</Label>
					<Select
						value={category}
						onValueChange={handleCategoryChange}
					>
						<SelectTrigger id="category">
						<SelectValue placeholder="Sélectionner une catégorie" />
						</SelectTrigger>
						<SelectContent>
						{operationCategoriesList.map((category: IOperationCategory) => (
							<SelectItem key={category.id} value={category.id}>
								{category.name}
							</SelectItem>
						))}
						</SelectContent>
					</Select>
				</div>

				{/* Unit id (only for common operations) */}
				{isCommon && (
				<div className="space-y-2">
					{/* Bâtiment */}
					<div className="space-y-2">
						<Label htmlFor="building" className="text-base font-semibold flex items-center gap-2">
							<Building2 className="w-4 h-4 text-indigo-600" />
							Bâtiment
						</Label>
						<Select
							value={selectedBuilding}
							onValueChange={handleBuildingChange}
						>
							<SelectTrigger id="building" className="h-12">
							<SelectValue placeholder="Sélectionner un bâtiment" />
							</SelectTrigger>
							<SelectContent>
							{buildingsList.map((building: IBuilding, index: number) => (
								<SelectItem key={`${building.id}-${index}`} value={building.id}>
								<div className="flex items-center gap-2">
									<span className="text-muted-foreground">{building.name}</span>
								</div>
								</SelectItem>
							))}
							</SelectContent>
						</Select>
					</div>

					{/* Étage */}
					<div className="space-y-2">
						<Label 
							htmlFor="floor" 
							className={`text-base font-semibold flex items-center gap-2 ${
							!selectedBuilding ? 'opacity-50' : ''
							}`}
						>
							<Layers className="w-4 h-4 text-purple-600" />
							Étage
						</Label>
						<Select
							value={selectedFloor}
							onValueChange={handleFloorChange}
							disabled={!selectedBuilding}
						>
							<SelectTrigger id="floor" className="h-12">
							<SelectValue placeholder={
								selectedBuilding 
								? "Sélectionner un étage" 
								: "Sélectionner d'abord un bâtiment"
							} />
							</SelectTrigger>
							<SelectContent>
							{floorsList.map((floor: IFloor, index: number) => (
								<SelectItem key={`${floor.id}${index}`} value={floor.id}>
								<div className="flex items-center gap-2">
									<span className="text-muted-foreground">
									{index === 0 ? 'Rez-de-chaussée' : `Etage ${index}`}
									</span>
								</div>
								</SelectItem>
							))}
							</SelectContent>
						</Select>
					</div>

					{/* Unit */}
					<div className="space-y-2">
					<Label 
						htmlFor="unit" 
						className={`text-base font-semibold flex items-center gap-2 ${
						!selectedFloor ? 'opacity-50' : ''
						}`}
					>
						<DoorOpen className="w-4 h-4 text-pink-600" />
						Unité concernée
					</Label>
					<Select
						value={selectedUnit}
						onValueChange={handleUnitChange}
						disabled={!selectedFloor}
					>
						<SelectTrigger id="unit" className="h-12">
						<SelectValue placeholder={
							selectedFloor 
							? "Sélectionner une unité" 
							: "Sélectionner d'abord un étage"
						} />
						</SelectTrigger>
						<SelectContent>
							{unitsList.map((unit: IUnit, index: number) => (
								<SelectItem key={`${unit.id}${index}`} value={unit.id}>
								<div className="flex items-center gap-2">
									<span className="font-semibold">{unit.name}</span>
								</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					</div>
				</div>
				)}

				{/* Titre */}
				<div className="space-y-2">
				<Label htmlFor="titre">
					Titre du signalement <span className="text-red-500">*</span>
				</Label>
				<Input
					id="titre"
					type="text"
					placeholder="Résumé du problème"
					value={operationData.title}
					onChange={(e) => handleInputChange('title', e.target.value)}
				/>
				</div>

				{/* Description */}
				<div className="space-y-2">
				<Label htmlFor="description">
					Description <span className="text-red-500">*</span>
				</Label>
				<Textarea
					id="description"
					placeholder="Décrivez le problème en détail..."
					rows={5}
					value={operationData.description}
					onChange={(e) => handleInputChange('description', e.target.value)}
				/>
				</div>

				{/* Photos */}
				<div className="space-y-2">
				<Label>Photos</Label>
				<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
					<input
					type="file"
					accept="image/*"
					multiple
					onChange={handlePhotoUpload}
					className="hidden"
					id="photo-upload"
					/>
					<label
					htmlFor="photo-upload"
					className="cursor-pointer flex flex-col items-center gap-2"
					>
					<Upload className="w-10 h-10 text-muted-foreground" />
					<span className="text-sm font-medium text-foreground">
						Cliquez pour ajouter des photos
					</span>
					<span className="text-xs text-muted-foreground">
						Plusieurs fichiers acceptés (JPG, PNG, etc.)
					</span>
					</label>
				</div>

				{/* Aperçu des photos */}
				{photos.length > 0 && (
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
					{photos.map(photo => (
						<div key={photo.id} className="relative group">
						<img
							src={photo.url}
							alt={photo.name}
							className="w-full h-32 object-cover rounded-lg border-2 border-border"
						/>
						<Button
							type="button"
							variant="destructive"
							size="icon"
							className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
							onClick={() => removePhoto(photo.id)}
						>
							<X className="h-4 w-4" />
						</Button>
						<p className="text-xs text-muted-foreground mt-1 truncate">
							{photo.name}
						</p>
						</div>
					))}
					</div>
				)}
				</div>

				{/* Bouton de soumission */}
				<Button
				onClick={handleSubmit}
				className="w-full"
				size="lg"
				>
				<Send className="mr-2 h-4 w-4" />
				Soumettre le signalement
				</Button>
			</CardContent>
			</Card>
		</div>
		</div>
	);
}