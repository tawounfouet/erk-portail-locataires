import { useState } from 'react';
import { Calendar, User, MapPin, Tag, Clock, Share2, Download, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getReportStatusBadge } from '@/services/badges';
import { useLocation } from 'react-router-dom';
import { IOperationDetail, IOperationList } from '@/types/operations.type';
import { getTimeElapsedStr } from '@/lib/date';


export default function DetailsReportsPage() {
	const [showShareAlert, setShowShareAlert] = useState(false);
	const location = useLocation();

	const { report, previousPage } = location.state as { report: IOperationDetail, previousPage: string };

	const etapes = [
		{ nom: 'Reçu', status: 'complete', date: '03/10/2025 14:30', remarque: 'Nous avons bien reçu votre demande.' },
		{ nom: 'Prise en charge', status: 'active', date: '03/10/2025 15:45', remarque: 'Votre report a été pris en compte par notre équipe et est actuellement en cours de traitement.' },
		{ nom: 'Confirmé', status: 'pending', date: '-' },
		{ nom: 'En cours de traitement', status: 'pending', date: '-' },
		{ nom: 'Traité', status: 'pending', date: '-' },
		{ nom: 'Clôturé', status: 'pending', date: '-' }
	];

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
			<title>Signalement ${report.id}</title>
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
			
			.badge-status {
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
			<div class="ref">Référence: ${report.id}</div>
			</div>
			
			<div class="section">
			<h2 class="section-title">${report.title}</h2>
			<div class="badges">
			<span class="badge badge-categorie">${report.operation_type_name}</span>
			<span class="badge badge-status">En cours</span>
			</div>
			</div>
			
			<div class="section">
			<h2 class="section-title">Informations générales</h2>
			<div class="info-grid">
				<div class="info-box">
				<div class="info-label">Signalé par</div>
				<div class="info-value">${report.requester_name}</div>
				<div class="info-sub">Locataire</div>
				</div>
				
				<div class="info-box">
				<div class="info-label">Date de transmission</div>
				<div class="info-value">${formatDate(report.created_at)}</div>
				</div>
				
				<div class="info-box">
				<div class="info-label">Type d'espace</div>
				${report.managed_unit_details ? `<div class="info-sub">Salle: ${report.managed_unit_details.full_name}</div>` : ''}
				</div>
				
				<div class="info-box">
				<div class="info-label">Temps écoulé</div>
				<div class="info-value">${getTimeElapsedStr(report.created_at)}</div>
				</div>
			</div>
			</div>
			
			<div class="section">
			<h2 class="section-title">Description détaillée</h2>
			<div class="description-box">
				<p>${report.description}</p>
			</div>
			</div>
			
			<div class="section">
			<h2 class="section-title">Suivi du traitement</h2>
			<div class="timeline">
				${etapes.map(etape => `
				<div class="timeline-item">
					<div class="timeline-icon ${etape.status}">
					${etape.status === 'complete' ? '✓' : etape.status === 'active' ? '●' : '○'}
					</div>
					<div class="timeline-content">
					<div class="timeline-title">${etape.nom}</div>
					<div class="timeline-date">${etape.date}</div>
					</div>
				</div>
				`).join('')}
			</div>
			</div>
			
			${report?.photos && report?.photos.length > 0 ? `
			<div class="section">
				<h2 class="section-title">Photos (${report?.photos.length})</h2>
				<div class="photos-grid">
				${report?.photos.map(photo => `
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

	const getEtapeIcon = (status) => {
		if (status === 'complete') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
		if (status === 'active') return <Circle className="w-5 h-5 text-blue-500 fill-blue-500" />;
		return <Circle className="w-5 h-5 text-gray-300" />;
	};

	return (
		<div className="max-w-5xl mx-auto space-y-6 pb-20">
			<div className="mb-6 mt-2">
                <h2 className="text-3xl font-bold text-white tracking-tight">Fiche de signalement</h2>
                <p className="text-gray-400 mt-1">Consultez les détails de votre signalement</p>
            </div>

		{/* Header actions */}
		<div>
			<div className="mt-3 flex gap-2">
				<Button variant="outline" onClick={handleShare} className="text-white">
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

		{/* Main infos */}
		<div className="shadow-lg">
			<div className="flex items-start justify-between bg-primary/20 border border-primary rounded-lg p-4">
				<div className="space-y-2 flex-1">
					<CardTitle className="text-2xl text-white">{report.title}</CardTitle>
					<h3 className="text-white mt-1"><span className="font-bold">Référence :</span><br/>{report.operation_number}</h3>

					<div className="flex flex-wrap gap-2">
						{getReportStatusBadge(report.status)}
						<Badge variant="outline">
							<Tag className="mr-1 h-3 w-3" />
							{report.operation_category}
						</Badge>
					</div>
				</div>
			</div>

			<div className="pt-6 space-y-6">
				{/* Requester infos */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="flex items-start gap-3 p-3 rounded-lg border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
						<User className="w-5 h-5 text-gray-100 mt-0.5" />

						<div>
							<p className="text-sm font-medium text-gray-100">Signalé par</p>
							<p className="font-semibold text-gray-100">{report.requester_name}</p>
							<p className="text-sm text-gray-400">Locataire</p>
						</div>
					</div>

					{/* Report creation date */}
					<div className="flex items-start gap-3 p-3 rounded-lg border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
						<Calendar className="w-5 h-5 text-gray-100 mt-0.5" />

						<div>
							<p className="text-sm font-medium text-gray-100">Date de transmission</p>
							<p className="text-sm text-gray-400">
							{formatDate(report.created_at)}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3 p-3 rounded-lg border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
						<MapPin className="w-5 h-5 text-gray-100 mt-0.5" />

						<div>
							<p className="text-sm font-medium text-gray-100">Unité concernée</p>
							{report.managed_unit_details && (
								<p className="text-sm text-slate-600">
									<span className="text-sm text-gray-400">{report.managed_unit_details.full_name}</span>
								</p>
							)}
						</div>
					</div>

					<div className="flex items-start gap-3 p-3 rounded-lg border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
						<Clock className="w-5 h-5 text-gray-100 mt-0.5" />
						
						<div>
							<p className="text-sm font-medium text-gray-100">Temps écoulé</p>
							<p className="text-sm text-gray-400">{getTimeElapsedStr(report.created_at)}</p>
						</div>
					</div>
				</div>

			<Separator />

			{/* Description */}
			<div>
				<h3 className="text-lg font-semibold text-white mb-3">Description détaillée</h3>
				<p className="text-slate-700 leading-relaxed bg-gray-400 p-4 rounded-lg">
				{report.description}
				</p>
			</div>

			<Separator />

			{/* Suivi du traitement */}
			{/* <div>
				<h3 className="text-lg font-semibold text-white mb-4">Suivi du traitement</h3>
				<div className="space-y-4">
				{etapes.map((etape, index) => (
					<div key={index} className="flex items-start gap-4">
						<div className="flex flex-col items-center">
							{getEtapeIcon(etape.status)}
							{index < etapes.length - 1 && (
							<div className={`w-0.5 h-12 mt-2 ${
								etape.status === 'complete' ? 'bg-green-500' : 'bg-gray-300'
							}`} />
							)}
						</div>
						<div className="flex-1 pb-4">
							<p className={`font-semibold ${
							etape.status === 'active' ? 'text-blue-600' : 
							etape.status === 'complete' ? 'text-slate-900' : 
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
			</div> */}

			{/* <Separator /> */}

			{/* Photos */}
			{/* {report.photos && report.photos.length > 0 && (
				<div>
				<h3 className="text-lg font-semibold text-slate-900 mb-4">
					Photos ({report.photos.length})
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{report.photos.map(photo => (
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
			)} */}
			</div>
		</div>

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
	);
}