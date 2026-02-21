import Redirector from "@/components/common/Redirector";
import { useAuth } from "@/hooks/useAuth";
import { getIconComponent } from "@/lib/icons";
import { formatERKEmailToDisplay } from "@/lib/user";
import { ERKModulesArray as AppModules } from "@/static/modules.static";
import { CheckCircle2, Clock, Home } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface INotificationCardProps {
  title: string;
  description: string;
  actionUrl?: string;
  sender?: string;
  created_at?: string;
}

function NotificationCard({ title, description, actionUrl }: INotificationCardProps) {
  return (
    <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 rounded-3xl p-6 relative overflow-hidden group cursor-pointer hover:border-primary/40 transition-colors">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl -mr-8 -mt-8" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary text-black rounded-full">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-primary font-semibold text-sm tracking-wide uppercase">Notification</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>

        {/* <div className="flex items-center text-sm font-medium text-white group-hover:underline decoration-primary decoration-2 underline-offset-4">
			Consulter les documents <CheckCircle2 className="w-4 h-4 ml-2" />
		</div> */}
      </div>
    </div>
  );
}

const notifications = [
  {
    id: 6,
    app: "Action Requise",
    icon: "signature", // Pourrait être une icône de stylo/contrat
    badge: 1,
    title: "Signature du bail électronique",
    subtitle: "Action requise : Merci de signer l'avenant à votre contrat.",
    time: "10m ago"
  },
  {
    id: 7,
    app: "Signalement #4502",
    icon: "check-circle",
    badge: 0,
    title: "État d'avancement : Résolu",
    subtitle: "Le problème de fuite d'eau a été marqué comme terminé.",
    time: "1h ago"
  },
  {
    id: 8,
    app: "Action Requise",
    icon: "upload",
    badge: 1,
    title: "Assurance habitation expirée",
    subtitle: "Veuillez téléverser votre nouvelle attestation pour 2026.",
    time: "3h ago"
  },
  {
    id: 9,
    app: "Signalement #4588",
    icon: "truck",
    badge: 1,
    title: "Prestataire en route",
    subtitle: "L'entreprise 'ElecPro' intervient sur votre tableau électrique.",
    time: "5h ago"
  },
  {
    id: 10,
    app: "Action Requise",
    icon: "calendar-check",
    badge: 1,
    title: "Confirmation de rendez-vous",
    subtitle: "Validez la date de l'état des lieux de sortie proposée.",
    time: "1d ago"
  }
];


export function NotificationList() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);

  const handleNext = () => {
    if (currentIndex < notifications.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    setOffsetX(currentX - startX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    setOffsetX(currentX - startX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (offsetX < -50 && currentIndex < notifications.length - 1) {
      handleNext();
    } else if (offsetX > 50 && currentIndex > 0) {
      handlePrev();
    }

    setOffsetX(0);
  };

  const visibleNotifications = [
    currentIndex - 1,
    currentIndex,
    currentIndex + 1,
    currentIndex + 2
  ].filter(i => i >= 0 && i < notifications.length);

  return (
    <>
      {/* Pile de notifications */}
      <div
        className="relative w-full max-w-2xl h-48 cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        {visibleNotifications.map((index) => {
          const notification = notifications[index];
          const position = index - currentIndex;
          const isActive = position === 0;

          let transform = '';
          let opacity = 1;
          let zIndex = 10 - position;
          let blur = 0;

          if (position === 0) {
            const dragOffset = isDragging ? offsetX : 0;
            transform = `translateX(${dragOffset}px) scale(1)`;
            opacity = 1;
          } else if (position === 1) {
            transform = 'translateX(8px) scale(0.98)';
            opacity = 0.75;
            blur = 2;
          } else if (position === 2) {
            transform = 'translateX(16px) scale(0.96)';
            opacity = 0.6;
            blur = 4;
          } else if (position === -1) {
            transform = 'translateX(-100%) scale(0.95)';
            opacity = 0;
          }

          return (
            <div
              key={notification.id}
              className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 absolute inset-0 backdrop-blur-xl rounded-3xl shadow-2xl transition-all duration-300 ease-out"
              style={{
                transform,
                opacity,
                zIndex,
                // I really hesitate to add blur
                // filter: `blur(${blur}px)`,
                pointerEvents: isActive ? 'auto' : 'none'
              }}
            >
              <div className="p-6 h-full">
                <div className="flex items-start gap-4">
                  {/* App Icon with Badge */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-primary shadow-md flex items-center justify-center">
                      <Clock className="w-7 h-7" />
                    </div>

                    {/* Badge */}
                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-lg">
                      {notification.badge}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col items-start">
                      <div className="w-full flex items-start justify-between">
                        <h4 className="text-primary font-bold uppercase">
                          {notification.app}
                        </h4>

                        {/* Time */}
                        <div className="text-gray-400 whitespace-nowrap">
                          {notification.time}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-white font-bold text-xl">
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 text-lg">
                          {notification.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      {/* <div className="flex gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-6 py-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all font-semibold text-gray-700"
        >
          ← Précédent
        </button>
        <div className="px-6 py-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg font-semibold text-gray-700">
          {currentIndex + 1} / {notifications.length}
        </div>
        <button
          onClick={handleNext}
          disabled={currentIndex === notifications.length - 1}
          className="px-6 py-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all font-semibold text-gray-700"
        >
          Suivant →
        </button>
      </div> */}
    </>
  );
}

export default function HomePage() {
  const { user } = useAuth();

  if (!user)
    return <Redirector />

  return (
    <div className="space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mt-2">
        <NotificationList />
      </div>

      {/* Grid Menu */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 ml-1">Accès Rapide</h3>
        <div className="grid grid-cols-2 gap-4">
          {
            AppModules.map((module) => {
              const Icon = getIconComponent(module.icon);
              return (
                <Link
                  key={`${module.id}`}
                  to={module.routes[0].path}
                  className="bg-[#2f2014] border border-white/5 p-5 rounded-3xl flex flex-col items-center text-center gap-3 hover:bg-white/5 active:scale-95 transition-all cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#403222] flex items-center justify-center group-hover:text-primary transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <span className="block text-white font-semibold">{module.title}</span>
                    <span className="text-xs text-gray-400">{module.description}</span>
                  </div>
                </Link>
              )
            })
          }
        </div>
      </div>

      {/* Bottom Info */}
      <div className="bg-secondary/30 rounded-2xl p-4 flex items-center justify-between border border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-800 rounded-full">
            <Home className="w-4 h-4 text-white" />
          </div>

          <div>
            <p className="text-sm font-medium text-white">Résidence Eureka</p>
            <p className="text-xs text-gray-400">{formatERKEmailToDisplay(user.email)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}