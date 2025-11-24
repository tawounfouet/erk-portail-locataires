import { Routes, Route } from 'react-router-dom';
import { LoginPage, MyAccountPage } from '@pages';
import { AuthProvider, ProtectedRoute } from '@/context';
import { Toaster } from '@/components/common/Toaster';
import ERKLayout from '@/components/layout/ERKLayout';
import { ERKModulesArray as AppModules } from './static/modules.static';
import { IERKModule } from '@/types/module.type';
import { generateRoutesFromModule } from '@/lib/module';
import HomePage from './pages/home/HomePage';
import { HomeSettingsPage } from './pages/settings';


export default function App() 
{
	return (
		<div className="min-h-screen bg-gradient-to-b from-amber-800/45 from-1% via-background via-50% to-background to-90% text-foreground overflow-x-hidden">
			<AuthProvider>
				<Routes>
					<Route path="/login" element={<LoginPage />} />

						<Route element={
							<ProtectedRoute>
								<ERKLayout />
							</ProtectedRoute>
						}>

							<Route path="/" element={<HomePage />} />
							<Route path="/settings">
								<Route index element={<HomeSettingsPage />} />
								<Route path="myaccount" element={<MyAccountPage />} />
							</Route>

							{/* Generate automatically nodes */}
							{AppModules.flatMap((module: IERKModule) => generateRoutesFromModule(module))}
						</Route>
				</Routes>

				<Toaster />
			</AuthProvider>
		</div>
	);
}
