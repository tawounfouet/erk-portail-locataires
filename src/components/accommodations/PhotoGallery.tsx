import { useState } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IAccommodation } from "@types/accomodations";

interface IPhotoGalleryProps
{
    accommodation: IAccommodation;
}

export default function PhotoGallery({ accommodation }: IPhotoGalleryProps)
{
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    

    const nextImage = () => {
        if (!accommodation) return;
        setCurrentImageIndex((prev) => (prev === accommodation.images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        if (!accommodation) return;
        setCurrentImageIndex((prev) => (prev === 0 ? accommodation.images.length - 1 : prev - 1));
    };


    return (
        <>
        <div className="relative mb-6 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 h-[400px] group">
            <img 
                src={accommodation.images[currentImageIndex]} 
                alt={`${accommodation.name} - vue ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
            />
            
            {/* Contrôles de navigation des images */}
            <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Image précédente"
            >
                <ChevronLeft size={24} />
            </button>

            <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Image suivante"
            >
                <ChevronRight size={24} />
            </button>
            
            {/* Indicateurs de position */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {accommodation.images.map((_: string, index: number) => (
                    <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        index === currentImageIndex 
                        ? 'bg-white' 
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Voir l'image ${index + 1}`}
                    />
                ))}
            </div>
            
            {/* Badge de disponibilité */}
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
                accommodation.available 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                {accommodation.available ? 'Disponible' : 'Liste d\'attente'}
            </div>
        </div>
        
        {/* Miniatures des images */}
        <div className="grid grid-cols-4 gap-2 mb-8">
            {accommodation.images.map((img: string, idx: number) => (
                <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-20 rounded-lg overflow-hidden ${
                    idx === currentImageIndex 
                        ? 'ring-2 ring-[#F7BF57]' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                >
                    <img 
                    src={img} 
                    alt={`${accommodation.name} - miniature ${idx + 1}`} 
                    className="w-full h-full object-cover"
                    />
                </button>
            ))}
        </div>
        </>
    );
}