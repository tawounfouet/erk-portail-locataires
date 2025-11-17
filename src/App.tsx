import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/layout';

import { 
  ContactsPage,
  ContactsWithCardsPage,
  DocsPage,
  DocsWithCardsPage,
  LoginPage,
  HomeReportsPage,
  NewReportsPage,
  DetailsReportsPage,
  NewSuggestionPage,
  MyAccountPage,
  NotificationsPage,
  MobileHomePage,
  HomeReportsWithCardsPage
} from '@pages';
import { AuthProvider, ProtectedRoute } from '@/components/context';
import { Toaster } from '@/components/common/Toaster';
import { useIsMobile } from './hooks/use-mobile';
import ERKLayout from './components/layout/ERKLayout';


function App() 
{
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

                <Route path="/reports" element={<HomeReportsWithCardsPage />} />
                <Route path="/reports/new" element={<NewReportsPage />} />
                <Route path="/reports/details" element={<DetailsReportsPage />} />
                
                <Route path="/docs" element={<DocsWithCardsPage />} />
                <Route path="/contacts" element={<ContactsWithCardsPage />} />

                <Route path="/suggestions" element={<NewSuggestionPage />} />

                <Route path="/myaccount" element={<MyAccountPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
            </Route>


      </Routes>

      <Toaster />
    </AuthProvider>
  );
}

export default App;