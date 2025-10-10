import React, { useState } from 'react';
import { Calendar, User, MapPin, Tag, Clock, Share2, Download, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getReportStatusBadge } from '@/services/badges';


export default function DetailsReportsPage() {
  const [showShareAlert, setShowShareAlert] = useState(false);

  // Example
  const signalement = {
    id: 'SIG-2025-1247',
    titre: 'Fuite d\'eau au plafond',
    description: 'Une fuite d\'eau importante a été constatée au niveau du plafond de la salle. L\'eau s\'écoule en continu et a déjà endommagé plusieurs tables et chaises. Le problème semble provenir de la tuyauterie au-dessus. Intervention urgente requise pour éviter des dégâts supplémentaires.',
    categorie: 'Maintenance',
    estEspaceCommun: true,
    identifiantSalle: 'B204',
    dateTransmission: '2025-10-03T14:30:00',
    auteur: {
      nom: 'Eru Eru Pita',
      email: 'erk-n5@eureka-residences.com',
      role: 'Etudiant MF'
    },
    statut: 'prise_en_charge',
    priorite: 'haute',
    photos: [
      { id: 1, url: 'https://i.f1g.fr/media/eidos/805x453_crop/2022/04/04/XVM0aac3694-b198-11ec-827f-33dd12f467ce.jpg', alt: 'Fuite au plafond' },
      { id: 2, url: 'https://www.bbexpo.be/fr/wp-content/uploads/sites/2/2024/01/humidite-placard.jpg', alt: 'Dégâts mobilier' },
      { id: 3, url: 'https://www.meilleur-deshumidificateur.fr/wp-content/uploads/2025/01/comment-enlever-humidite-placard.webp', alt: 'Vue d\'ensemble' }
    ]
  };

  const etapes = [
    { nom: 'Reçu', statut: 'complete', date: '03/10/2025 14:30', remarque: 'Nous avons bien reçu votre demande.' },
    { nom: 'Prise en charge', statut: 'active', date: '03/10/2025 15:45', remarque: 'Votre signalement a été pris en compte par notre équipe et est actuellement en cours de traitement.' },
    { nom: 'Confirmé', statut: 'pending', date: '-' },
    { nom: 'En cours de traitement', statut: 'pending', date: '-' },
    { nom: 'Traité', statut: 'pending', date: '-' },
    { nom: 'Clôturé', statut: 'pending', date: '-' }
  ];

//   const getStatutBadge = (statut) => {
//     const variants = {
//       signale: { variant: 'secondary', label: 'Signalé' },
//       en_cours: { variant: 'default', label: 'En cours' },
//       resolu: { variant: 'outline', label: 'Résolu' },
//       cloture: { variant: 'outline', label: 'Clôturé' }
//     };
//     const config = variants[statut] || variants.signale;
//     return <Badge variant={config.variant}>{config.label}</Badge>;
//   };

  const getPrioriteBadge = (priorite) => {
    const config = {
      haute: { className: 'bg-red-500 hover:bg-red-600', label: 'Haute priorité' },
      moyenne: { className: 'bg-orange-500 hover:bg-orange-600', label: 'Priorité moyenne' },
      basse: { className: 'bg-green-500 hover:bg-green-600', label: 'Basse priorité' }
    };
    const { className, label } = config[priorite] || config.moyenne;
    return <Badge className={className}>{label}</Badge>;
  };

  const handleShare = () => {
    setShowShareAlert(true);
    setTimeout(() => setShowShareAlert(false), 3000);
  };

 const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Signalement ${signalement.id}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            padding: 40px;
            max-width: 210mm;
            margin: 0 auto;
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #3b82f6;
          }
          
          .header h1 {
            color: #1e293b;
            font-size: 28px;
            margin-bottom: 10px;
          }
          
          .header .ref {
            color: #64748b;
            font-size: 14px;
          }
          
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
          }
          
          .badges {
            display: flex;
            gap: 10px;
            margin: 15px 0;
            flex-wrap: wrap;
          }
          
          .badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
          }
          
          .badge-statut {
            background-color: #3b82f6;
            color: white;
          }
          
          .badge-priorite-haute {
            background-color: #ef4444;
            color: white;
          }
          
          .badge-priorite-moyenne {
            background-color: #f97316;
            color: white;
          }
          
          .badge-priorite-basse {
            background-color: #22c55e;
            color: white;
          }
          
          .badge-categorie {
            background-color: #f1f5f9;
            color: #475569;
            border: 1px solid #cbd5e1;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 20px 0;
          }
          
          .info-box {
            background-color: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
          }
          
          .info-label {
            font-size: 12px;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          
          .info-value {
            font-size: 15px;
            color: #1e293b;
            font-weight: 600;
          }
          
          .info-sub {
            font-size: 13px;
            color: #64748b;
            margin-top: 3px;
          }
          
          .description-box {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            margin: 15px 0;
          }
          
          .description-box p {
            color: #475569;
            line-height: 1.8;
          }
          
          .timeline {
            margin: 20px 0;
          }
          
          .timeline-item {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
            align-items: flex-start;
          }
          
          .timeline-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
          }
          
          .timeline-icon.complete {
            background-color: #22c55e;
            color: white;
          }
          
          .timeline-icon.active {
            background-color: #3b82f6;
            color: white;
          }
          
          .timeline-icon.pending {
            background-color: #e2e8f0;
            color: #94a3b8;
          }
          
          .timeline-content {
            flex: 1;
          }
          
          .timeline-title {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 3px;
          }
          
          .timeline-date {
            font-size: 13px;
            color: #64748b;
          }
          
          .photos-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 20px 0;
          }
          
          .photo-box {
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            height: 200px;
          }
          
          .photo-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
            text-align: center;
          }
          
          @media print {
            body {
              padding: 20px;
            }
            
            .section {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Fiche de Signalement</h1>
          <div class="ref">Référence: ${signalement.id}</div>
        </div>
        
        <div class="section">
          <h2 class="section-title">${signalement.titre}</h2>
          <div class="badges">
            <span class="badge badge-statut">En cours</span>
            <span class="badge badge-priorite-${signalement.priorite}">${
              signalement.priorite === 'haute' ? 'Haute priorité' :
              signalement.priorite === 'moyenne' ? 'Priorité moyenne' : 'Basse priorité'
            }</span>
            <span class="badge badge-categorie">${signalement.categorie}</span>
          </div>
        </div>
        
        <div class="section">
          <h2 class="section-title">Informations générales</h2>
          <div class="info-grid">
            <div class="info-box">
              <div class="info-label">Signalé par</div>
              <div class="info-value">${signalement.auteur.nom}</div>
              <div class="info-sub">${signalement.auteur.role}</div>
              <div class="info-sub">${signalement.auteur.email}</div>
            </div>
            
            <div class="info-box">
              <div class="info-label">Date de transmission</div>
              <div class="info-value">${formatDate(signalement.dateTransmission)}</div>
            </div>
            
            <div class="info-box">
              <div class="info-label">Type d'espace</div>
              <div class="info-value">${signalement.estEspaceCommun ? 'Espace commun' : 'Espace non commun'}</div>
              ${signalement.estEspaceCommun ? `<div class="info-sub">Salle: ${signalement.identifiantSalle}</div>` : ''}
            </div>
            
            <div class="info-box">
              <div class="info-label">Temps écoulé</div>
              <div class="info-value">1 jour</div>
              <div class="info-sub">Depuis la création</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2 class="section-title">Description détaillée</h2>
          <div class="description-box">
            <p>${signalement.description}</p>
          </div>
        </div>
        
        <div class="section">
          <h2 class="section-title">Suivi du traitement</h2>
          <div class="timeline">
            ${etapes.map(etape => `
              <div class="timeline-item">
                <div class="timeline-icon ${etape.statut}">
                  ${etape.statut === 'complete' ? '✓' : etape.statut === 'active' ? '●' : '○'}
                </div>
                <div class="timeline-content">
                  <div class="timeline-title">${etape.nom}</div>
                  <div class="timeline-date">${etape.date}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        ${signalement.photos && signalement.photos.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Photos (${signalement.photos.length})</h2>
            <div class="photos-grid">
              ${signalement.photos.map(photo => `
                <div class="photo-box">
                  <img src="${photo.url}" alt="${photo.alt}">
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="footer">
          <p><strong>Note de confidentialité:</strong> Ce document est confidentiel et destiné uniquement aux personnes autorisées.</p>
          <p>Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEtapeIcon = (statut) => {
    if (statut === 'complete') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (statut === 'active') return <Circle className="w-5 h-5 text-blue-500 fill-blue-500" />;
    return <Circle className="w-5 h-5 text-gray-300" />;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header avec actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Fiche de Signalement</h1>
            <p className="text-slate-600 mt-1">Référence: {signalement.id}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Partager
            </Button>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
          </div>
        </div>

        {showShareAlert && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              Lien de partage copié dans le presse-papiers !
            </AlertDescription>
          </Alert>
        )}

        {/* Informations principales */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-2xl">{signalement.titre}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {getReportStatusBadge(signalement.statut)}
                  {/* {getPrioriteBadge(signalement.priorite)} */}
                  <Badge variant="outline">
                    <Tag className="mr-1 h-3 w-3" />
                    {signalement.categorie}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Informations en grille */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <User className="w-5 h-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-600">Signalé par</p>
                  <p className="font-semibold text-slate-900">{signalement.auteur.nom}</p>
                  <p className="text-sm text-slate-600">{signalement.auteur.role}</p>
                  <p className="text-sm text-slate-500">{signalement.auteur.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <Calendar className="w-5 h-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-600">Date de transmission</p>
                  <p className="font-semibold text-slate-900">
                    {formatDate(signalement.dateTransmission)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <MapPin className="w-5 h-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-600">Type d'espace</p>
                  <p className="font-semibold text-slate-900">
                    {signalement.estEspaceCommun ? 'Espace commun' : 'Espace non commun'}
                  </p>
                  {signalement.estEspaceCommun && (
                    <p className="text-sm text-slate-600">
                      Salle: <span className="font-medium">{signalement.identifiantSalle}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <Clock className="w-5 h-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-600">Temps écoulé</p>
                  <p className="font-semibold text-slate-900">1 jour</p>
                  <p className="text-sm text-slate-600">Depuis la création</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Description détaillée</h3>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg">
                {signalement.description}
              </p>
            </div>

            <Separator />

            {/* Suivi du traitement */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Suivi du traitement</h3>
              <div className="space-y-4">
                {etapes.map((etape, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      {getEtapeIcon(etape.statut)}
                      {index < etapes.length - 1 && (
                        <div className={`w-0.5 h-12 mt-2 ${
                          etape.statut === 'complete' ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className={`font-semibold ${
                        etape.statut === 'active' ? 'text-blue-600' : 
                        etape.statut === 'complete' ? 'text-slate-900' : 
                        'text-slate-400'
                      }`}>
                        {etape.nom}
                      </p>
                      <p className="text-slate-600">{etape.remarque}</p>
                      <p className="text-sm text-slate-600">{etape.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Photos */}
            {signalement.photos && signalement.photos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Photos ({signalement.photos.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {signalement.photos.map(photo => (
                    <div key={photo.id} className="group relative aspect-video overflow-hidden rounded-lg border-2 border-slate-200 hover:border-slate-400 transition-colors">
                      <img
                        src={photo.url}
                        alt={photo.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Note de bas de page */}
        <Card className="bg-slate-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-slate-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900">Note</p>
                <p className="text-sm text-slate-600">
                  Ce document est confidentiel et destiné uniquement aux personnes autorisées. 
                  Toute reproduction ou diffusion sans autorisation est strictement interdite.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}