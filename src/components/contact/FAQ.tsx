import { ChevronRight } from "lucide-react";

export default function FAQ()
{
    const faqItems = [
        {
            question: "Comment réserver une chambre ?",
            answer: "Pour réserver une chambre dans l'une de nos résidences, vous pouvez utiliser notre plateforme de réservation en ligne, nous contacter par téléphone ou venir directement à notre bureau d'accueil pendant les horaires d'ouverture."
        },
        {
            question: "Quels documents sont nécessaires pour une réservation ?",
            answer: "Pour réserver, vous aurez besoin d'une pièce d'identité valide, d'un justificatif de scolarité ou d'admission à l'université, et d'un justificatif de garant ou de ressources suffisantes."
        },
        {
            question: "Les résidences sont-elles sécurisées 24h/24 ?",
            answer: "Oui, toutes nos résidences disposent d'un système de sécurité 24h/24 avec contrôle d'accès, vidéosurveillance et personnel de sécurité présent la nuit."
        },
        {
            question: "Comment se passe le paiement du loyer ?",
            answer: "Le paiement du loyer peut se faire en ligne via notre plateforme sécurisée, par virement bancaire ou en espèces à notre bureau. Nous proposons des options de paiement mensuel, trimestriel ou annuel."
        }
    ];

    return (
        <div className="space-y-4">
            {faqItems.map((item, index) => (
            <details 
                key={index} 
                className="group border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
            >
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 dark:text-gray-200 py-2">
                <span>{item.question}</span>
                <span className="transition group-open:rotate-180">
                    <ChevronRight size={16} className="text-[#F7BF57]" />
                </span>
                </summary>
                <p className="text-gray-600 dark:text-gray-400 mt-3 ml-4 group-open:animate-fadeIn">
                {item.answer}
                </p>
            </details>
            ))}
        </div>
    );
}