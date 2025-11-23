export interface IBugReport {
  id?: string;
  title: string;
  description: string;
  endpoint?: string;
  method?: string;
  environment: 'development' | 'preproduction' | 'production';
  steps: string[];
  expectedResult: string;
  actualResult: string;
  sampleData?: string;
  errorDetails?: string;
  priority: 'blocking' | 'high' | 'medium' | 'low';
  impact?: string;
  userAgent?: string;
  url?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface IBugReportResponse {
  success: boolean;
  reportId?: string;
  message?: string;
  error?: string;
}