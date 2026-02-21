import { useEffect, useState } from "react";
import { ChevronLeft, Check, X, Send, Bed, Monitor, DoorClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import PatrimoineService from "@/services/patrimoine";
import { IInventoryItem } from "@/types/patrimoine.type";

interface InventoryItem {
    id: string | number;
    name: string;
    status: string;
    condition: "NEUF" | "BON ÉTAT" | "USAGE LÉGER" | "ABÎMÉ";
    description: string;
    image: string;
    icon: any;
    validated?: boolean;
    rejected?: boolean;
}

const initialItems: InventoryItem[] = [
    {
        id: 1,
        name: "Lit & Matelas",
        status: "NEUF",
        condition: "NEUF",
        description: "Matelas mousse HR haute densité, état neuf. Cadre de lit en bois sans rayures apparentes. Sommier à lattes intact.",
        image: "/src/assets/images/room1.jpeg",
        icon: Bed,
    },
    {
        id: 2,
        name: "Bureau de travail",
        status: "BON ÉTAT",
        condition: "BON ÉTAT",
        description: "Plateau en chêne, quelques rayures légères sur le coin gauche. Pieds en métal stables. Tiroir fonctionnel.",
        image: "/src/assets/images/room2.jpeg",
        icon: Monitor,
    },
    {
        id: 3,
        name: "Penderie & Placard",
        status: "NEUF",
        condition: "NEUF",
        description: "Portes coulissantes fluides. Étagères propres sans éclats. Barre de penderie solidement fixée.",
        image: "/src/assets/images/room3.jpeg",
        icon: DoorClosed,
    },
    {
        id: 4,
        name: "Chaise de bureau",
        status: "USAGE LÉGER",
        condition: "USAGE LÉGER",
        description: "Pivotante, roulettes fonctionnelles. Tissu légèrement décoloré.",
        image: "/src/assets/images/room4.jpeg",
        icon: Bed,
    }
];

export default function InventoryValidationPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState<InventoryItem[]>(initialItems);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                /*
                setIsLoading(true);
                const response = await PatrimoineService.getInventory();
                if (response.results && response.results.length > 0) {
                    const mappedItems: InventoryItem[] = response.results.map((item: IInventoryItem) => ({
                        id: item.id,
                        name: item.name,
                        status: item.category_display || "À vérifier",
                        // Map category or other field to condition if possible, else fallback
                        condition: "NEUF",
                        description: item.description || "",
                        image: item.main_image_url || "https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=800&auto=format&fit=crop",
                        icon: Bed, // Default icon
                        validated: false,
                        rejected: false
                    }));
                    setItems(mappedItems);
                }
                */
            } catch (error) {
                console.error("Failed to fetch inventory:", error);
                // Keep initialItems as fallback
            } finally {
                setIsLoading(false);
            }
        };

        fetchInventory();
    }, []);

    const handleApprove = (id: string | number) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, validated: true, rejected: false } : item
        ));
    };

    const handleReject = (id: string | number) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, validated: false, rejected: true } : item
        ));
    };

    const validatedCount = items.filter(item => item.validated).length;
    const totalCount = items.length;
    const progressPercent = (validatedCount / totalCount) * 100;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background p-6 space-y-6">
                <div className="h-8 w-48 bg-secondary/20 rounded-lg animate-pulse" />
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-secondary/10 rounded-2xl animate-pulse border border-white/5" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-white/5 px-4 py-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-gray-400">Progression globale</span>
                        <span className="text-sm font-bold text-primary">{validatedCount} / {totalCount} validés</span>
                    </div>
                    <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 pt-6 pb-48 space-y-6">
                {items.map((item) => (
                    <Card key={item.id} className="bg-secondary/10 border-white/5 overflow-hidden">
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/20 p-2 rounded-lg">
                                    <item.icon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white leading-tight">{item.name}</h3>
                                    <Badge variant="outline" className={`mt-1 border-none px-0 text-xs font-bold ${item.condition === 'ABÎMÉ' ? 'text-red-400' : 'text-primary'
                                        }`}>
                                        {item.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="aspect-[16/9] w-full relative rounded-xl overflow-hidden border border-white/10 bg-black/20">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=800&auto=format&fit=crop';
                                    }}
                                />
                            </div>

                            <p className="text-sm text-gray-400 leading-relaxed">
                                {item.description}
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    onClick={() => handleApprove(item.id)}
                                    className={`w-full py-6 rounded-xl font-bold flex gap-2 transition-all ${item.validated
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                                        : 'bg-primary/95 hover:bg-primary text-white'
                                        }`}
                                >
                                    <Check className="w-5 h-5" />
                                    Approuver
                                </Button>
                                <Button
                                    onClick={() => handleReject(item.id)}
                                    variant="secondary"
                                    className={`w-full py-6 rounded-xl font-bold flex gap-2 border border-white/10 transition-all ${item.rejected
                                        ? 'bg-red-900/40 border-red-500/50 text-red-400'
                                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                                        }`}
                                >
                                    <X className="w-5 h-5" />
                                    Refuser
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Footer Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-white/5 space-y-4">
                <Button
                    disabled={validatedCount < totalCount}
                    className="w-full py-8 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl flex gap-3 shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
                >
                    Finaliser l'état des lieux
                    <Send className="w-5 h-5" />
                </Button>
                <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest leading-normal">
                    En finalisant, vous certifiez l'exactitude des informations relevées.
                </p>
            </div>
        </>
    );
}
