import { useState } from 'react';
import { Bug, Send, Share2, Camera, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBugReport } from '@/hooks/useBug';
import { TPlatform } from '@/types/share.type';
import { IBugReport } from '@/types/bug.type';
import { currentEnv, IsInDevelopment } from '@/static/dev.static';
import { useAuth } from '@/hooks/useAuth';
import Redirector from '../common/Redirector';

export default function BugReportButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [autoShare, setAutoShare] = useState(true);
    const [sharePlatform, setSharePlatform] = useState<TPlatform>('whatsapp');
    const [steps, setSteps] = useState<string[]>(['']);
    const { user } = useAuth();
    
    const { reportBug, quickShareBug, shareBugReport } = useBugReport();

    const addStep = () => {
        setSteps([...steps, '']);
    };

    const updateStep = (index: number, value: string) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };

    const removeStep = (index: number) => {
        if (steps.length > 1) {
            setSteps(steps.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        
        const bugData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            environment: (formData.get('environment') as any) || 'development',
            endpoint: formData.get('endpoint') as string,
            method: formData.get('method') as string,
            steps: steps.filter(step => step.trim() !== ''),
            expectedResult: formData.get('expectedResult') as string,
            actualResult: formData.get('actualResult') as string,
            priority: (formData.get('priority') as any) || 'medium',
            impact: formData.get('impact') as string,
            sampleData: formData.get('sampleData') as string,
            errorDetails: formData.get('errorDetails') as string,
        };

        try {
            const completeBugReport: IBugReport = {
                ...bugData,
                timestamp: new Date().toISOString(),
                userAgent: navigator?.userAgent || 'Unknown',
                url: typeof window !== 'undefined' ? window.location.href : 'Server'
            };

            
            await shareBugReport(completeBugReport);
            setIsOpen(false);
            // Reset form
            setSteps(['']);
        } catch (error) {
            console.error('Failed to submit bug report:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuickReport = () => {
        quickShareBug(
            "Bug rapide",
            "Problème rencontré lors de l'utilisation",
            undefined,
            { platform: 'whatsapp', priority: 'medium' }
        );
    };

    if (!user)
        return <Redirector />

    if (!user.is_staff || !user.is_active)
        return <></>

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="fixed bottom-32 right-7 z-50 shadow-lg border border-primary text-primary">
                        <Bug className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-white">
                            <Bug className="h-5 w-5" />
                            Signaler un bug
                        </DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Section Informations générales */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2 text-white">Informations générales</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 text-gray-400">
                                    <Label htmlFor="title">Titre du bug *</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="Description courte et claire du problème"
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-2 text-gray-400">
                                    <Label htmlFor="environment">Environnement *</Label>
                                    <Select name="environment" defaultValue={currentEnv}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="development">🛠️ Développement</SelectItem>
                                            <SelectItem value="preproduction">🧪 Pré-production</SelectItem>
                                            <SelectItem value="production">🚀 Production</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2 text-gray-400">
                                <Label htmlFor="description">Description détaillée *</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Décrivez le problème de manière détaillée..."
                                    rows={3}
                                    required
                                />
                            </div>
                        </div>

                        {/* Section API (optionnelle) */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2 text-white">Informations API (si applicable)</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 text-gray-400">
                                    <Label htmlFor="endpoint">Endpoint</Label>
                                    <Input
                                        id="endpoint"
                                        name="endpoint"
                                        placeholder="/api/v1/endpoint"
                                    />
                                </div>
                                
                                <div className="space-y-2 text-gray-400">
                                    <Label htmlFor="method">Méthode HTTP</Label>
                                    <Select name="method">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                            <SelectItem value="PATCH">PATCH</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Section Scénario */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-gray-400">
                                <h3 className="text-lg font-semibold">Scénario de reproduction *</h3>
                                <Button type="button" variant="outline" size="sm" onClick={addStep}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Ajouter une étape
                                </Button>
                            </div>
                            
                            <div className="space-y-3 text-gray-400">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex gap-2 items-start">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-sm font-medium mt-1">
                                            {index + 1}
                                        </div>
                                        <Textarea
                                            placeholder={`Étape ${index + 1}...`}
                                            value={step}
                                            onChange={(e) => updateStep(index, e.target.value)}
                                            className="flex-1"
                                            rows={2}
                                        />
                                        {steps.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeStep(index)}
                                                className="mt-1"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section Résultats */}
                        <div className="space-y-4 text-gray-400">
                            <h3 className="text-lg font-semibold border-b pb-2">Résultats</h3>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="expectedResult" className="text-green-800">
                                        ✅ Résultat attendu *
                                    </Label>
                                    <Textarea
                                        id="expectedResult"
                                        name="expectedResult"
                                        placeholder="Ce qui devrait normalement se produire..."
                                        rows={2}
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="actualResult" className="text-red-800">
                                        ❌ Résultat actuel *
                                    </Label>
                                    <Textarea
                                        id="actualResult"
                                        name="actualResult"
                                        placeholder="Ce qui se produit réellement..."
                                        rows={2}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section Impact et Priorité */}
                        <div className="space-y-4 text-gray-400">
                            <h3 className="text-lg font-semibold border-b pb-2 text-white">Impact et Priorité</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 text-gray-400">
                                    <Label htmlFor="priority">Priorité *</Label>
                                    <Select name="priority" defaultValue="medium">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">🟢 Faible</SelectItem>
                                            <SelectItem value="medium">🟡 Moyenne</SelectItem>
                                            <SelectItem value="high">🟠 Élevée</SelectItem>
                                            <SelectItem value="blocking">🔴 Bloquante</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="space-y-2 text-gray-400">
                                    <Label htmlFor="impact">Impact</Label>
                                    <Input
                                        id="impact"
                                        name="impact"
                                        placeholder="Ex: Tous les utilisateurs, Fonctionnalité X..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section Données techniques */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2 text-white">Données techniques</h3>
                            
                            <div className="space-y-4 text-gray-400">
                                <div className="space-y-2 text-gray-400">
                                    <Label htmlFor="sampleData">Données d'exemple (JSON)</Label>
                                    <Textarea
                                        id="sampleData"
                                        name="sampleData"
                                        placeholder='{"champ": "valeur"}'
                                        rows={3}
                                        className="font-mono text-sm"
                                    />
                                </div>
                                
                                <div className="space-y-2 text-gray-400">
                                    <Label htmlFor="errorDetails" className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        Détails de l'erreur (stack trace, logs...)
                                    </Label>
                                    <Textarea
                                        id="errorDetails"
                                        name="errorDetails"
                                        placeholder="Coller ici les erreurs complètes..."
                                        rows={4}
                                        className="font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section Options */}
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="text-lg font-semibold text-white">Options d'envoi</h3>
                            
                            <div className="space-y-4 text-gray-400">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="autoShare"
                                        checked={autoShare}
                                        onChange={(e) => setAutoShare(e.target.checked)}
                                        className="rounded"
                                    />
                                    <Label htmlFor="autoShare" className="flex items-center gap-2">
                                        <Share2 className="h-4 w-4" />
                                        Partager automatiquement avec le support
                                    </Label>
                                </div>
                                
                                {autoShare && (
                                    <div className="ml-6 space-y-2 text-gray-400">
                                        <Label htmlFor="sharePlatform">Plateforme de partage</Label>
                                        <Select value={sharePlatform} onValueChange={(value: TPlatform) => setSharePlatform(value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                                <SelectItem value="telegram">Telegram</SelectItem>
                                                <SelectItem value="email">Email</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between pt-6 border-t text-gray-400">
                            <div className="flex gap-2">
                                <Button type="submit" disabled={isSubmitting}>
                                    <Send className="h-4 w-4 mr-2" />
                                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer le rapport'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Annuler
                                </Button>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleQuickReport}
                            >
                                Rapport rapide
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}