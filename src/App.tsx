import { Routes, Route } from 'react-router-dom';
import { LoginPage, MobileHomePage } from '@pages';
import { AuthProvider, ProtectedRoute } from '@/components/context';
import { Toaster } from '@/components/common/Toaster';
import ERKLayout from '@/components/layout/ERKLayout';
import { getAllModules } from './static/modules.static';
import { IERKModule } from '@/types/module.type';
import { generateRoutesFromModule } from '@/lib/module';


export default function App() 
{
	const erkModules = getAllModules();

	return (
		<AuthProvider>
			<Routes>
				<Route path="/login" element={<LoginPage />} />

					<Route element={
						<ProtectedRoute>
							<ERKLayout />
						</ProtectedRoute>
					}>

						<Route path="/" element={<MobileHomePage />} />

						{/* Génération automatique de toutes les routes des modules */}
						{erkModules.flatMap((module: IERKModule) => generateRoutesFromModule(module))}
					</Route>
			</Routes>

			<Toaster />
		</AuthProvider>
	);
}
