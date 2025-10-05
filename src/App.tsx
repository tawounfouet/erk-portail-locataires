import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/layout';

import { 
  ContactsPage, 
  DocsPage, 
  LoginPage, 
  HomeReportsPage,
  NewReportsPage,
  DetailsReportsPage,
  NewSuggestionPage
} from '@pages'
import { AuthProvider, ProtectedRoute } from '@/components/context';

function App() 
{
  return (
    <AuthProvider>
      <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
              <Route path="/" element={<div>Bureau</div>} />

              <Route path="/reports" element={<HomeReportsPage />} />
              <Route path="/reports/new" element={<NewReportsPage />} />
              <Route path="/reports/details" element={<DetailsReportsPage />} />
              
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/contacts" element={<ContactsPage />} />

              <Route path="/suggestions" element={<NewSuggestionPage />} />
          </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;