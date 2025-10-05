import { useState, useEffect } from 'react';
import type { IReport } from '@/types/reports.type';
import { getReportsAsync } from '@/services/reports';

export function useReports() {
    const [reports, setReports] = useState<IReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadReports = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getReportsAsync();

                setReports(data.reports);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }

        loadReports();        
    }, []);

    const addReport = (report: Omit<IReport, 'id'>) => {
        const newReport: IReport = {
            ...report,
            id: Math.max(...reports.map(c => c.id)) + 1
        };
        setReports(prev => [...prev, newReport]);
    };

    const updateReport = (id: number, updates: Partial<IReport>) => {
        setReports(prev => 
                prev.map(report => 
                report.id === id ? { ...report, ...updates } : report
            )
        );
    };

    const deleteReport = (id: number) => {
        setReports(prev => prev.filter(report => report.id !== id));
    };

    const getReportId = (id: number): IReport | undefined => {
        return reports.find(report => report.id === id);
    };

    const filterByCategory = (category: string): IReport[] => {
        return reports.filter(report => report.category === category);
    };

    return {
        reports,
        loading,
        error,
        addReport,
        updateReport,
        deleteReport,
        getReportId,
        filterByCategory
    };
}