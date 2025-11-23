import { useState } from 'react';
import { Lightbulb, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import SuggestionService from '@/services/suggestions';
import { ISuggestionCreate, SuggestionsCategoryMappingArray, TSuggestionCategory } from '@/types/suggestions.type';

export default function NewSuggestionPage() {
	// ==========================================
	// 				 SERVICE DATA 
	// ==========================================
	const { user } = useAuth();
	const { toast } = useToast();
	
	// ==========================================
	// 				 FORM DATA 
	// ==========================================
	const [formData, setFormData] = useState<ISuggestionCreate>({
		nom: user?.full_name || '',
		email: user?.email || '',
		telephone: user?.phone || '',
		categorie: '',
		titre: '',
		description: '',
		anonyme: false,
		rappel: false
	});

	// ==========================================
	// 				 FORM HANDLERS
	// ==========================================
	const handleInputChange = (name: string, value: boolean | string | TSuggestionCategory) => {
		setFormData(prev => ({
		...prev,
		[name]: value
		}));
	};

	const handleSubmit = async () => {
		// Required field checking
		if (!formData.titre || !formData.description || !formData.categorie) {
			toast({
				title: '',
				description: 'Veuillez remplir tous les champs obligatoires'
			});
			return;
		}

		// Check user info if not incognito
		if (!formData.anonyme && (!formData.nom || !formData.email)) {
			toast({
				title: 'Hey !',
				description: 'Renseignes tes coordonnées ou coches la case "Suggestion anonyme" si tu ne veux pas qu\'on sâche de qui il s\'agit'
			});
			return;
		}
		
		try {
			const suggestionData: Partial<ISuggestionCreate> = {
				titre: formData.titre,
				description: formData.description,
				categorie: formData.categorie,
				anonyme: formData.anonyme,
				rappel: formData.rappel
			};

			// Add data if user is not incognito
			if (!formData.anonyme) {
				suggestionData.nom = formData.nom;
				suggestionData.email = formData.email;
				suggestionData.telephone = formData.telephone || undefined; // Optionnel
			}

			await SuggestionService.createSuggestion(suggestionData);

			// Réinitialiser le formulaire
			setFormData({
				nom: user?.full_name || '',
				email: user?.email || '',
				telephone: user?.phone || '',
				categorie: '',
				titre: '',
				description: '',
				anonyme: false,
				rappel: false
			});

			// Toast de confirmation
			toast({
				title: 'Yeesss !',
				description: 'Votre suggestion a été soumise avec succès. Nous l\'examinerons attentivement.',
				variant: 'default'
			});

		} catch (error) {
			console.error('Erreur lors de la soumission de la suggestion:', error);
			
			// Gestion des erreurs
			let errorMessage = 'Une erreur est survenue lors de l\'envoi de votre suggestion.';
			
			if (error instanceof Error) {
				if (error.message.includes('Session expirée')) {
					errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
				} else if (error.message.includes('HTTP error')) {
					errorMessage = 'Erreur de connexion au serveur. Veuillez réessayer.';
				} else {
					errorMessage = error.message;
				}
			}

			toast({
				title: 'Erreur',
				description: errorMessage,
				variant: 'destructive'
			});
		}
	};

	// ==========================================
	// 				   RENDER
	// ==========================================

	return (
		<div className="min-h-screen">
		<div className="max-w-3xl mx-auto">
			<Card className="shadow-xl border-t-4 border-t-primary">
			<CardHeader className="text-center pb-8">
				<div className="flex justify-center mb-4">
					<div className="bg-primary p-4 rounded-full">
						<Lightbulb className="w-12 h-12 text-white" />
					</div>
				</div>
				<CardTitle className="text-3xl mb-2">Boîte à Suggestions</CardTitle>
				<CardDescription className="text-base">
					Votre avis compte ! Partagez vos idées pour améliorer notre résidence.
					Chaque suggestion est étudiée avec attention par notre équipe.
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-6">
				<div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
				<Checkbox
					id="anonyme"
					checked={formData.anonyme}
					onCheckedChange={(checked) => handleInputChange('anonyme', checked)}
				/>
				<div className="space-y-1">
					<Label
					htmlFor="anonyme"
					className="text-base font-medium cursor-pointer leading-none"
					>
					Suggestion anonyme
					</Label>
					<p className="text-sm text-slate-600">
					Cochez cette case si vous souhaitez soumettre votre suggestion de manière anonyme
					</p>
				</div>
				</div>

				{/* Informations personnelles (masquées si anonyme) */}
				{!formData.anonyme && (
				<div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
					<h3 className="font-semibold text-slate-900 flex items-center gap-2">
					<span className="text-blue-600">📋</span>
					Vos coordonnées
					</h3>
					
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2 md:col-span-2">
						<Label htmlFor="nom">
						Nom complet <span className="text-red-500">*</span>
						</Label>
						<Input
						id="nom"
						type="text"
						placeholder="Eru Eru Pita"
						value={formData.nom}
						onChange={(e) => handleInputChange('nom', e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">
						Email <span className="text-red-500">*</span>
						</Label>
						<Input
						id="email"
						type="email"
						placeholder="eru.pita@exemple.com"
						value={formData.email}
						onChange={(e) => handleInputChange('email', e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="telephone">Téléphone (optionnel)</Label>
						<Input
						id="telephone"
						type="tel"
						placeholder="+237 699 12 34 56 78"
						value={formData.telephone}
						onChange={(e) => handleInputChange('telephone', e.target.value)}
						/>
					</div>
					</div>

					<div className="flex items-center space-x-2 pt-2">
					<Checkbox
						id="rappel"
						checked={formData.rappel}
						onCheckedChange={(checked) => handleInputChange('rappel', checked)}
					/>
					<Label
						htmlFor="rappel"
						className="text-sm cursor-pointer"
					>
						Je souhaite être contacté(e) pour discuter de ma suggestion
					</Label>
					</div>
				</div>
				)}

				{/* Catégorie */}
				<div className="space-y-2">
				<Label htmlFor="categorie">
					Catégorie de la suggestion <span className="text-red-500">*</span>
				</Label>
				<Select
					value={formData.categorie}
					onValueChange={(value) => handleInputChange('categorie', value)}
				>
					<SelectTrigger id="categorie">
					<SelectValue placeholder="Sélectionner une catégorie" />
					</SelectTrigger>

					<SelectContent>
						{SuggestionsCategoryMappingArray.map(([categoryId, categoryValue]) => (
							<SelectItem key={categoryId} value={categoryId}>
								{categoryValue}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				</div>

				{/* Titre */}
				<div className="space-y-2">
				<Label htmlFor="titre">
					Titre de votre suggestion <span className="text-red-500">*</span>
				</Label>
				<Input
					id="titre"
					type="text"
					placeholder="Résumez votre idée en quelques mots"
					value={formData.titre}
					onChange={(e) => handleInputChange('titre', e.target.value)}
				/>
				</div>

				{/* Description */}
				<div className="space-y-2">
				<Label htmlFor="description">
					Description détaillée <span className="text-red-500">*</span>
				</Label>
				<Textarea
					id="description"
					placeholder="Décrivez votre suggestion de manière détaillée. N'hésitez pas à expliquer pourquoi cette amélioration serait bénéfique et comment elle pourrait être mise en place..."
					rows={6}
					value={formData.description}
					onChange={(e) => handleInputChange('description', e.target.value)}
				/>
				<p className="text-xs text-slate-500">
					Plus votre description est détaillée, mieux nous pourrons évaluer votre suggestion
				</p>
				</div>

				{/* Bouton de soumission */}
				<div className="pt-4">
				<Button
					onClick={handleSubmit}
					className="w-full"
					size="lg"
				>
					<Send className="mr-2 h-5 w-5" />
					Envoyer ma suggestion
				</Button>
				</div>

				{/* Message d'information */}
				<div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
				<p className="text-sm text-amber-900">
					<span className="font-semibold">💡 Bon à savoir :</span> Toutes les suggestions sont examinées 
					par notre équipe de gestion. Leurs auteurs sont informés de l'avancement de la mise en œuvre de leur suggestion.
				</p>
				</div>
			</CardContent>
			</Card>

			{/* Exemples de suggestions */}
			<Card className="mt-6 bg-gradient-to-br from-slate-50 to-slate-100">
			<CardHeader>
				<CardTitle className="text-lg">Exemples de suggestions</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="space-y-2 text-sm text-slate-700">
				<li className="flex items-start gap-2">
					<span className="text-emerald-500 font-bold">•</span>
					<span>Amélioration de l'éclairage dans les zones de passage</span>
				</li>
				<li className="flex items-start gap-2">
					<span className="text-emerald-500 font-bold">•</span>
					<span>Création de salle de convivialité</span>
				</li>
				<li className="flex items-start gap-2">
					<span className="text-emerald-500 font-bold">•</span>
					<span>Installation panneau solaire</span>
				</li>
				
				<li className="flex items-start gap-2">
					<span className="text-emerald-500 font-bold">•</span>
					<span>Organisation d'événements mensuels pour favoriser la convivialité</span>
				</li>
				</ul>
			</CardContent>
			</Card>
		</div>
		</div>
	);
}