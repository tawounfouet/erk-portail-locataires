import React, { useState } from 'react';
import { AlertCircle, Upload, X, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function NewReportsPage() {
  const [estEspaceCommun, setEstEspaceCommun] = useState(true);
  const [formData, setFormData] = useState({
    categorie: '',
    identifiantSalle: '',
    titre: '',
    description: '',
  });
  const [photos, setPhotos] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const categoriesEspaceCommun = [
    'Propreté',
    'Équipement défectueux',
    'Sécurité',
    'Maintenance',
    'Autre'
  ];

  const categoriesEspaceNonCommun = [
    'Problème technique',
    'Infrastructure',
    'Accessibilité',
    'Signalisation',
    'Autre'
  ];

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
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

  const handleSubmit = () => {
    if (!formData.categorie || !formData.titre || !formData.description) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (estEspaceCommun && !formData.identifiantSalle) {
      alert('Veuillez renseigner l\'identifiant de la salle');
      return;
    }

    console.log('Données du formulaire:', {
      estEspaceCommun,
      ...formData,
      photos: photos.map(p => p.name)
    });
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    // Réinitialiser le formulaire
    setFormData({
      categorie: '',
      identifiantSalle: '',
      titre: '',
      description: '',
    });
    setPhotos([]);
  };

  const categories = estEspaceCommun ? categoriesEspaceCommun : categoriesEspaceNonCommun;

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

            {/* Type d'espace */}
            <div className="flex items-center space-x-2 p-4 bg-primary/5 rounded-lg">
              <Checkbox
                id="espaceCommun"
                checked={estEspaceCommun}
                onCheckedChange={setEstEspaceCommun}
              />
              <Label
                htmlFor="espaceCommun"
                className="text-base font-medium cursor-pointer"
              >
                Il s'agit d'un espace commun
              </Label>
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <Label htmlFor="categorie">
                Catégorie <span className="text-red-500">*</span>
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

            {/* Identifiant salle (uniquement pour espace commun) */}
            {estEspaceCommun && (
              <div className="space-y-2">
                <Label htmlFor="identifiantSalle">
                  Identifiant de la salle <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="identifiantSalle"
                  type="text"
                  placeholder="Ex: ERK-N, ERK-SE1, ERK-SS3"
                  value={formData.identifiantSalle}
                  onChange={(e) => handleInputChange('identifiantSalle', e.target.value)}
                />
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
                value={formData.titre}
                onChange={(e) => handleInputChange('titre', e.target.value)}
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
                value={formData.description}
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