import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react";

export default function AvailabilitySchedule() {
  const schedules = [
    { service: "Gestion administrative", hours: "Lun-Ven: 9h-12h / 14h-17h" },
    { service: "Urgences", hours: "24h/24 - 7j/7" },
    { service: "Services courants", hours: "Lun-Sam: 8h-20h" },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Horaires de disponibilité
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {schedules.map((schedule, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{schedule.service}</span>
              <span className="text-sm text-gray-600">{schedule.hours}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 <strong>Bon à savoir :</strong> Pour les problèmes urgents, privilégiez 
            les messages whatsapp aux numéros des gestionnaires de la résidence pour une réponse plus rapide.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}