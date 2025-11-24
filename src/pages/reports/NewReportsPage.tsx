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
import { IOperationCategory, ICreateOperationPayload } from '@/types/operations.type';
import { useBuildingHierarchy, useBuildings } from '@/hooks/usePatrimoine';
import { IBuilding, IFloor, IUnit } from '@/types/patrimoine.type';
import OperationService from '@/services/operations';
import { useNavigate } from 'react-router-dom';


export default function NewReportsPage() {
	// ==========================================
	// 				 FORM DATA 
	// ==========================================
	const [category, setCategory] = useState<string>('');
	const [selectedBuilding, setSelectedBuilding] = useState<string>('');
	const [selectedFloor, setSelectedFloor] = useState<string>('');
	const [selectedUnit, setSelectedUnit] = useState<string>('');

	// Type pour les photos uploadées
	interface UploadedPhoto {
		id: string;
		name: string;
		url: string;
		file: File;
	}

	const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
	const [operationData, setOperationData] = useState<ICreateOperationPayload>({
		operation_type_code: 'RENTAL_COMPLAINT',  // ✅ Code du type, pas UUID
		title: '',
		description: '',
		priority: 'NORMAL',
		managed_unit: null,  // ✅ Bon nom de champ
	});
	const [isCommon, setIsCommon] = useState(true);
	const [showSuccess, setShowSuccess] = useState<boolean>(false);

	// ==========================================
	// 				 SERVICE DATA
	// ==========================================
	const { buildingsList, isLoading } = useBuildings();
	const { floorsList, unitsList, isLoading: hierarchyIsLoading } = useBuildingHierarchy(selectedBuilding);
	const { operationCategoriesList } = useOperationCategories();
	const navigate = useNavigate();


	// ==========================================
	// 				 FORM HANDLERS
	// ==========================================

	const handleInputChange = (name: string, value: string) => {
		setOperationData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		const newPhotos: UploadedPhoto[] = files.map(file => ({
			id: Math.random().toString(36).substr(2, 9),
			name: file.name,
			url: URL.createObjectURL(file),
			file: file
		}));
		setPhotos(prev => [...prev, ...newPhotos]);
	};

	const removePhoto = (id: string) => {
		setPhotos(prev => prev.filter(photo => photo.id !== id));
	};

	const handleCommonChange = (value: boolean) => {
		setIsCommon(value);
		// handleUnitChange(user_room);
	}

	const handleCategoryChange = (value: string) => {
		setCategory(value);
		// TODO: Récupérer le code du type d'opération depuis la catégorie sélectionnée
		// Pour l'instant, on utilise un code par défaut
		handleInputChange('operation_type_code', 'RENTAL_COMPLAINT');
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
		handleInputChange('managed_unit', value);  // ✅ Correction: managed_unit au lieu de managed_unit_details
	}

	const handleSubmit = async () => {
		if (!operationData.title || !operationData.description) {
			alert('Veuillez remplir tous les champs obligatoires');
			return;
		}

		if (isCommon && !operationData.managed_unit) {
			alert('Veuillez renseigner l\'identifiant de l\'unité');
			return;
		}

		try {
			console.log('📤 Envoi du signalement:', operationData);

			// 1️⃣ Créer l'opération
			const operation = await OperationService.createOperation(operationData);
			console.log('✅ Signalement créé:', operation);

			// 2️⃣ Upload des photos si présentes
			if (photos.length > 0) {
				console.log(`📸 Upload de ${photos.length} photo(s)...`);
				try {
					const photoFiles = photos.map(p => p.file);
					const attachments = await OperationService.uploadOperationPhotos(
						operation.id,
						photoFiles,
						'photo_evidence'  // 🎯 Photos de signalement pour les utilisateurs
					);
					console.log(`✅ ${attachments.length} photo(s) uploadée(s)`);
				} catch (photoError) {
					console.error('⚠️ Erreur lors de l\'upload des photos:', photoError);
					alert('Le signalement a été créé, mais certaines photos n\'ont pas pu être uploadées.');
				}
			}

			// Afficher le message de succès
			setShowSuccess(true);
			setTimeout(() => setShowSuccess(false), 5000);

			// Reset form
			setOperationData({
				operation_type_code: 'RENTAL_COMPLAINT',
				title: '',
				description: '',
				priority: 'NORMAL',
				managed_unit: null,
			});
			setPhotos([]);
			setCategory('');
			setSelectedBuilding('');
			setSelectedFloor('');
			setSelectedUnit('');

			navigate('/reports');

		} catch (error) {
			console.error('❌ Erreur lors de la création du signalement:', error);
			alert('Erreur lors de la création du signalement. Vérifiez la console pour plus de détails.');
		}
	};

	// ==========================================
	// 				 	RENDER
	// ==========================================

	if (isLoading || hierarchyIsLoading) {
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
		<div className="pb-20">
			<div className="mb-8 mt-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">Nouveau Signalement</h2>
                <p className="text-gray-300 mt-1">Remplissez ce formulaire pour signaler un problème</p>
            </div>

			<div className="space-y-6">
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
						className="text-gray-300 font-medium cursor-pointer"
					>
						Il s'agit d'un bien commun
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
						<SelectTrigger id="category" className="w-full h-12 bg-[#333337] border border-white/10 rounded-full p-4 text-white placeholder:text-white-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all">
							<SelectValue placeholder="Sélectionner une catégorie" />
						</SelectTrigger>
						<SelectContent className="w-full bg-[#333337] border border-white/10 rounded-xl p-4 text-white placeholder:text-white-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all">
							{operationCategoriesList.map((category: IOperationCategory) => (
								<SelectItem key={category.id} value={category.id} className="text-white">
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
							<Label htmlFor="building" className="text-base font-semibold flex items-center gap-2 text-gray-300">
								<Building2 className="w-4 h-4 text-indigo-600" />
								Bâtiment
							</Label>
							<Select
								value={selectedBuilding}
								onValueChange={handleBuildingChange}
							>
								<SelectTrigger id="building" className="w-full h-12 bg-[#333337] border border-white/10 rounded-full p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all">
									<SelectValue placeholder="Sélectionner un bâtiment" />
								</SelectTrigger>
								<SelectContent className="w-full bg-[#333337] border border-white/10 rounded-xl p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all">
									{buildingsList.map((building: IBuilding, index: number) => (
										<SelectItem key={`${building.id}-${index}`} value={building.id} className="text-white">
												{building.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Étage */}
						<div className="space-y-2">
							<Label
								htmlFor="floor"
								className={`text-gray-300 text-base font-semibold flex items-center gap-2 ${!selectedBuilding ? 'opacity-50' : ''
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
								<SelectTrigger id="floor" className="w-full h-12 bg-[#333337] border border-white/10 rounded-full p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all">
									<SelectValue placeholder={
										selectedBuilding
											? "Sélectionner un étage"
											: "Sélectionner d'abord un bâtiment"
									} />
								</SelectTrigger>
								<SelectContent className="w-full bg-[#333337] border border-white/10 rounded-xl p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all">
									{floorsList.map((floor: IFloor, index: number) => (
										<SelectItem key={`${floor.id}${index}`} value={floor.id} className="text-white">
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
								Unité concernée
							</Label>
							<Select
								value={selectedUnit}
								onValueChange={handleUnitChange}
								disabled={!selectedFloor}
							>
								<SelectTrigger id="unit" className="w-full h-12 bg-[#333337] border border-white/10 rounded-full p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all">
									<SelectValue placeholder={
										selectedFloor
											? "Sélectionner une unité"
											: "Sélectionner d'abord un étage"
									} />
								</SelectTrigger>
								<SelectContent className="w-full bg-[#333337] border border-white/10 rounded-xl p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all">
									{unitsList.map((unit: IUnit, index: number) => (
										<SelectItem key={`${unit.id}${index}`} value={unit.id} className="text-white">
											{unit.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				)}

				{/* Titre */}
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
						className="w-full h-12 bg-[#333337] border border-white/10 rounded-full p-4 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
					/>
				</div>

				{/* Description */}
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
						className="w-full bg-[#333337] border border-white/10 rounded-2xl p-4 text-white placeholder:text-white-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
					/>
				</div>

				{/* Photos */}
				<div className="space-y-2 text-gray-300">
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
							<span className="text-sm font-medium text-muted-foreground">
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
					size="lg"
					className="w-full shadow-primary/30 shadow-md rounded-full"
				>
					<Send className="mr-2 h-4 w-4" />
					Soumettre le signalement
				</Button>
			</div>
		</div>
	);
}