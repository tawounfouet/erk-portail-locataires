import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput() 
{
    // ==========================================
	// 				   STATE
	// ==========================================
        
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // ==========================================
	// 				   FORM HANDLERS
	// ==========================================

    const handleSubmit = () => {
        console.log('Mot de passe:', password);
        // Traiter le mot de passe ici
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mot de passe
            </Label>

            <div className="relative">
                <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    className="pr-10"
                />
                
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                    {showPassword ? (<EyeOff className="h-4 w-4" />) : (<Eye className="h-4 w-4" />)}
                </button>
            </div>
            </div>
        </div>
    );
}