import React, { useState } from 'react';
import { Lightbulb, Send, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function NewSuggestionPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    categorie: '',
    titre: '',
    description: '',
    anonyme: false,
    rappel: false
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    'Amélioration des espaces communs',
    'Services et équipements',
    'Activités et événements',
    'Sécurité et confort',
    'Communication',
    'Environnement et durabilité',
    'Autre'
  ];

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.titre || !formData.description || !formData.categorie) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!formData.anonyme && (!formData.nom || !formData.email)) {
      alert('Veuillez renseigner vos coordonnées ou cochez la case "Suggestion anonyme"');
      return;
    }

    console.log('Suggestion soumise:', formData);
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
    
    // Réinitialiser le formulaire
    setFormData({
      nom: '',
      email: '',
      telephone: '',
      categorie: '',
      titre: '',
      description: '',
      anonyme: false,
      rappel: false
    });
  };

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
            {showSuccess && (
              <Alert className="bg-emerald-50 border-emerald-200 animate-in fade-in slide-in-from-top-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-800 font-medium">
                  Merci pour votre suggestion ! Nous l'examinerons attentivement et vous tiendrons informé.
                </AlertDescription>
              </Alert>
            )}

            {/* Option anonyme */}
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
                      placeholder="Jean Dupont"
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
                      placeholder="jean.dupont@exemple.fr"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone (optionnel)</Label>
                    <Input
                      id="telephone"
                      type="tel"
                      placeholder="06 12 34 56 78"
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
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
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