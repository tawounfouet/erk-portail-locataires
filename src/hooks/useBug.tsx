import { useCallback } from 'react';
import BugReportService from '@/services/bug';
import { IBugReport } from '@/types/bug.type';
import { TPlatform } from '@/types/share.type';

export const useBugReport = () => {
    const reportBug = useCallback(async (
        bugData: Omit<IBugReport, 'id' | 'timestamp'>, 
        options?: {
        autoShare?: boolean;
        sharePlatform?: TPlatform;
        shareContact?: string;
        }
    ) => {
        return await BugReportService.reportBug(bugData, options);
    }, []);

    const shareBugReport = useCallback(async (
        bugReport: IBugReport,
        platform: TPlatform = 'whatsapp',
        contact?: string
    ) => {
        return await BugReportService.shareBugReport(bugReport, platform, contact);
    }, []);

    const quickShareBug = useCallback((
        title: string,
        description: string,
        error?: string,
        options?: {
        platform?: TPlatform;
        contact?: string;
        priority?: IBugReport['priority'];
        }
    ) => {
        BugReportService.quickShareBug(title, description, error, options);
    }, []);

    const getShareLink = useCallback((
        bugData: Omit<IBugReport, 'id' | 'timestamp'>,
        platform: TPlatform = 'whatsapp'
    ): string => {
        return BugReportService.getBugShareLink(bugData, platform);
    }, []);

    return {
        reportBug,
        shareBugReport,
        quickShareBug,
        getShareLink
    };
};