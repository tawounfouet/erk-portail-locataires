import { Coffee, Home, Shield, Wifi } from "lucide-react";
import { IAccommodation } from "@types/accomodations";
import { ButtonLink } from "@components/common";

interface IAccommodationCardProps
{
    accommodation: IAccommodation
}

export default function AccommodationCard({ accommodation }: IAccommodationCardProps)
{
    // Fonction pour obtenir l'icône correspondant à une caractéristique
    const getFeatureIcon = (feature: string) => {
        if (feature.toLowerCase().includes('lit')) return <Home size={16} className="text-[#F7BF57]" />;
        if (feature.toLowerCase().includes('wifi')) return <Wifi size={16} className="text-[#F7BF57]" />;
        if (feature.toLowerCase().includes('kitchenette')) return <Coffee size={16} className="text-[#F7BF57]" />;
        return <Shield size={16} className="text-[#F7BF57]" />;
    };

    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
            {/* Image du logement */}
            <div className="relative">
                <ButtonLink
                    to={`/logements/${accommodation.id}`}
                    removeBackground
                >
                    <img 
                        src={accommodation.imageUrl} 
                        alt={accommodation.name} 
                        className="w-full h-full object-cover"
                    />

                    {/* Badge de disponibilité */}
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                        accommodation.available 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200'
                        }`}
                    >
                        {accommodation.available ? 'Disponible' : 'Liste d\'attente'}
                    </div>
                </ButtonLink>
            </div>
            
            {/* Contenu */}
            <div className="p-6">
            <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {   accommodation.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {accommodation.residenceName}
                </p>
            </div>
            
            <div className="flex justify-between items-center mb-4">
                <span className="text-[#F7BF57] font-medium">{accommodation.size} m²</span>
                <span className="text-gray-900 dark:text-gray-100 font-bold">
                    {/* {accommodation.price.toLocaleString()} F.CFA */}
                <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">/mois</span>
                </span>
            </div>
            
            {/* Caractéristiques */}
            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-5">
                <div className="grid grid-cols-2 gap-2">
                {accommodation.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    {getFeatureIcon(feature)}
                    <span className="ml-2">{feature}</span>
                    </div>
                ))}
                </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex justify-between">
                <ButtonLink
                    to={`/logements/${accommodation.id}`}
                    removeBackground
                >
                    Plus de détails
                </ButtonLink>
                
                {accommodation.available ? (
                    <ButtonLink
                        to="/reservation"
                        className="bg-[#F7BF57] hover:bg-[#e6af4a] text-white px-4 py-2 rounded-md text-sm transition-colors"
                    >
                        Réserver
                    </ButtonLink>
                    ) : (
                    <ButtonLink
                        to="/liste-attente"
                        className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                    >
                        Liste d'attente
                    </ButtonLink>
                )}
            </div>
            </div>
        </div>  
    );
}