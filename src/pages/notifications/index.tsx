import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useState } from "react";


export default function NotificationsPage()
{
    const [notifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Nouvelle offre disponible',
      message: 'Découvrez notre nouvelle offre Premium+ avec 50% de réduction',
      date: '2025-11-10',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Budget bientôt épuisé',
      message: 'Il vous reste 1160Fcfa sur votre budget EurekaShop ce mois-ci',
      date: '2025-11-09',
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Paiement confirmé',
      message: 'Votre abonnement Starlink a été renouvelé avec succès',
      date: '2025-11-01',
      read: true
    },
    {
      id: 4,
      type: 'info',
      title: 'Mise à jour disponible',
      message: 'De nouvelles fonctionnalités sont disponibles dans votre espace',
      date: '2025-10-28',
      read: true
    }
  ]);

    const unreadCount = notifications.filter(n => !n.read).length;
    
    const getTypeColor = (type) => {
      switch(type) {
        case 'success': return 'bg-green-100 text-green-800 border-green-200';
        case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500 mt-1">
              {unreadCount > 0 ? `${unreadCount} message${unreadCount > 1 ? 's' : ''} non lu${unreadCount > 1 ? 's' : ''}` : 'Aucun nouveau message'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline">
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.map(notif => (
            <Card key={notif.id} className={`transition-all ${!notif.read ? 'border-l-4 border-l-blue-500' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(notif.type)}`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{notif.title}</h3>
                        <p className="text-gray-600">{notif.message}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(notif.date).toLocaleDateString('fr-FR', { 
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };