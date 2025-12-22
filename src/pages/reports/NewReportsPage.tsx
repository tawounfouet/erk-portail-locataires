import PageHeader from '@/components/common/PageHeader';
import NewReportForm from '@/components/operations/NewReportForm';

export default function NewReportsPage() {	
	return (
		<div className="pb-20">
			<PageHeader 
				title="Nouveau Signalement" 
				description="Remplissez ce formulaire pour signaler un problème" 
			/>

			<div className="space-y-6">
				<NewReportForm />
			</div>
		</div>
	);
}