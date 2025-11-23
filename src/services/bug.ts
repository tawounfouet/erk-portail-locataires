import { IBugReport, IBugReportResponse } from "@/types/bug.type";
import type { TPlatform } from "@/types/share.type";
import ShareService from "./share";

/**
 * Automated bug reporting service with sharing integration
 * Sends bug reports to technical support through multiple channels
 */
export default class BugService {
    private static readonly STORAGE_KEY = 'pending_bug_reports';
    private static readonly MAX_RETRIES = 3;
    private static readonly RETRY_DELAY = 5000;

    // Service configuration
    private static readonly config = {
        apiEndpoint: '/api/v1/bug-reports',
        emailEndpoint: '/api/v1/send-bug-email',
        slackWebhookUrl: '',
        fallbackEmail: 'support@eureka-residences.com',
        supportWhatsAppNumber: '237690191404' // Technical support phone number
    };

    /**
     * Submits a bug report and optionally shares it
     * @param bugData - Bug report data without id and timestamp
     * @param options - Configuration options for sharing behavior
     * @returns Promise with the report submission result
     */
    static async reportBug(
        bugData: Omit<IBugReport, 'id' | 'timestamp'>, 
        options: {
            autoShare?: boolean;
            sharePlatform?: TPlatform;
            shareContact?: string;
        } = {}
    ): Promise<IBugReportResponse> {
        const completeBugReport: IBugReport = {
            ...bugData,
            timestamp: new Date().toISOString(),
            userAgent: navigator?.userAgent || 'Unknown',
            url: typeof window !== 'undefined' ? window.location.href : 'Server'
        };

        try {
            // Attempt immediate submission
            const result = await this.sendBugReport(completeBugReport);
            
            if (result.success) {
                console.log('✅ Bug report sent successfully:', result.reportId);
                
                // Automatic sharing if requested
                if (options.autoShare) {
                 await this.shareBugReport(completeBugReport, options.sharePlatform, options.shareContact);
                }
                
                return result;
            } else {
                await this.savePendingReport(completeBugReport);
                return result;
            }
        } catch (error) {
            console.error('❌ Failed to send bug report:', error);
            await this.savePendingReport(completeBugReport);
            
            // Share even if submission failed
            if (options.autoShare) {
                await this.shareBugReport(completeBugReport, options.sharePlatform, options.shareContact);
            }
            
            return {
                success: false,
                error: 'Failed to send bug report, saved for retry'
            };
        }
    }

    /**
     * Shares a bug report using the sharing service
     * @param bugReport - Complete bug report to share
     * @param platform - Target sharing platform
     * @param contact - Specific contact for sharing (phone number or email)
     */
    static async shareBugReport(
        bugReport: IBugReport, 
        platform: TPlatform = 'whatsapp',
        contact: string | null = null
    ): Promise<void> {
        try {
            const shareMessage = this.formatBugReportForSharing(bugReport);
            
            // Use existing ShareService
            if (platform === 'whatsapp') {
                ShareService.shareToWhatsapp(shareMessage, contact);
            } else {
                // For other platforms, use shareGeneric
                await ShareService.shareGeneric(shareMessage, [platform]);
            }
            
            console.log(`✅ Bug report shared via ${platform}`);
        } catch (error) {
            console.error(`❌ Failed to share bug report via ${platform}:`, error);
        }
    }

    /**
     * Automatically reports and shares a JavaScript error
     * @param error - JavaScript Error object
     * @param context - Additional context about where the error occurred
     * @param shareOptions - Sharing configuration options
     */
    static async reportAndShareJSError(
        error: Error, 
        context?: {
            component?: string;
            action?: string;
            data?: any;
        },
        shareOptions: {
            platform?: TPlatform;
            contact?: string;
        } = {}
    ): Promise<void> {
        const bugReport: Omit<IBugReport, 'id' | 'timestamp'> = {
        title: `JS Error: ${error.message.substring(0, 100)}`,
        description: `A JavaScript error occurred in the application.`,
        environment: this.getCurrentEnvironment(),
        steps: [
            'User navigating in the application',
            `Error triggered in: ${context?.component || 'Unknown'}`,
            `Action: ${context?.action || 'Unknown'}`
        ],
        expectedResult: 'Application works normally',
        actualResult: `Error: ${error.message}`,
        errorDetails: error.stack || error.toString(),
        priority: 'high',
        impact: 'Feature affected',
        sampleData: context?.data ? JSON.stringify(context.data, null, 2) : undefined,
        metadata: {
            errorType: 'javascript',
            component: context?.component,
            action: context?.action
        }
        };

        await this.reportBug(bugReport, {
        autoShare: true,
        sharePlatform: shareOptions.platform,
        shareContact: shareOptions.contact
        });
    }

    /**
     * Reports and shares an API error
     * @param endpoint - API endpoint that failed
     * @param method - HTTP method used
     * @param status - HTTP status code received
     * @param error - Error details from the API
     * @param requestData - Request payload that caused the error
     * @param shareOptions - Sharing configuration options
     */
    static async reportAndShareAPIError(
        endpoint: string,
        method: string,
        status: number,
        error: any,
        requestData?: any,
        shareOptions: {
        platform?: TPlatform;
        contact?: string;
        } = {}
    ): Promise<void> {
        const priority = status >= 500 ? 'blocking' : status >= 400 ? 'high' : 'medium';

        const bugReport: Omit<IBugReport, 'id' | 'timestamp'> = {
            title: `API Error ${status}: ${endpoint}`,
            description: `API error on endpoint ${endpoint}`,
            endpoint,
            method,
            environment: this.getCurrentEnvironment(),
            steps: [
                `${method} request to ${endpoint}`,
                `Data sent: ${requestData ? 'Yes' : 'No'}`,
                `Response received: HTTP ${status}`
            ],
            expectedResult: 'Successful API response (2xx)',
            actualResult: `HTTP ${status} error`,
            sampleData: requestData ? JSON.stringify(requestData, null, 2) : undefined,
            errorDetails: JSON.stringify(error, null, 2),
            priority,
            impact: 'API functionality affected',
            metadata: {
                errorType: 'api',
                statusCode: status
            }
        };

        await this.reportBug(bugReport, {
            autoShare: true,
            sharePlatform: shareOptions.platform,
            shareContact: shareOptions.contact
        });
    }

    /**
     * Formats a bug report for sharing across platforms
     * @param bugReport - Complete bug report to format
     * @returns Formatted string ready for sharing
     */
    private static formatBugReportForSharing(bugReport: IBugReport): string {
        const priorityIcons = {
            blocking: '🔴 BLOQUANT',
            high: '🟠 IMPORTANT', 
            medium: '🟡 MOYEN',
            low: '🔵 FAIBLE'
        };

        const environmentNames = {
            development: '🛠️ Developpement',
            preproduction: '🧪 Pré-production',
            production: '🚀 Production'
        };

        return `
🐛 *BUG REPORT* 🐛

${priorityIcons[bugReport.priority]} - ${bugReport.title}
${environmentNames[bugReport.environment]}

📋 *Description:*
${bugReport.description}

🔄 *Scenario:*
${bugReport.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

✅ *Attendu:* ${bugReport.expectedResult}
❌ *Actuel:* ${bugReport.actualResult}

${bugReport.endpoint ? `📍 *Endpoint:* ${bugReport.method} ${bugReport.endpoint}` : ''}
${bugReport.impact ? `👥 *Impact:* ${bugReport.impact}` : ''}

${bugReport.errorDetails ? `💥 *Erreur:* ${bugReport.errorDetails.substring(0, 200)}...` : ''}

🕒 *Date:* ${new Date(bugReport.timestamp).toLocaleString('fr-FR')}
🌐 *URL:* ${bugReport.url || 'N/A'}

#bug
        `.trim();
    }

    /**
     * Generates a pre-filled sharing link for a bug report
     * @param bugReport - Bug report data without id and timestamp
     * @param platform - Target sharing platform
     * @returns Pre-formatted sharing URL
     */
    static getBugShareLink(
        bugReport: Omit<IBugReport, 'id' | 'timestamp'>,
        platform: TPlatform = 'whatsapp'
    ): string {
        const message = this.formatBugReportForSharing({
        ...bugReport,
        timestamp: new Date().toISOString(),
        userAgent: 'Unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'Server'
        });

        const encodedMessage = encodeURIComponent(message);

        switch (platform) {
        case 'whatsapp':
            return `${ShareService['WHATSAPP_API_URL']}?text=${encodedMessage}`;
        
        case 'telegram':
            return `${ShareService['TELEGRAM_BASE_URL']}?text=${encodedMessage}`;
        
        case 'email':
            return `${ShareService['EMAIL_BASE_URL']}?subject=${encodeURIComponent(`Bug: ${bugReport.title}`)}&body=${encodedMessage}`;
        
        default:
            return '';
        }
    }

    /**
     * Quick sharing method for developers - simplified bug reporting
     * @param title - Brief description of the bug
     * @param description - Detailed explanation of the issue
     * @param error - Error details if available
     * @param options - Additional configuration options
     */
    static quickShareBug(
        title: string,
        description: string,
        error?: string,
        options: {
        platform?: TPlatform;
        contact?: string;
        priority?: IBugReport['priority'];
        } = {}
): void 
    {
        const bugReport: Omit<IBugReport, 'id' | 'timestamp'> = {
        title,
        description,
        environment: this.getCurrentEnvironment(),
        steps: ['User action not specified'],
        expectedResult: 'Normal operation',
        actualResult: 'Error or unexpected behavior',
        errorDetails: error,
        priority: options.priority || 'medium',
        impact: 'User affected'
        };

        this.reportBug(bugReport, {
        autoShare: true,
        sharePlatform: options.platform,
        shareContact: options.contact
        });
    }

    /**
     * Sends bug report to the backend API
     * @param bugReport - Complete bug report to send
     * @returns API response with submission result
     */
    private static async sendBugReport(bugReport: IBugReport): Promise<IBugReportResponse> {
        try {
            const response = await fetch(this.config.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bugReport)
            });

            if (!response.ok) throw new Error(`API responded with ${response.status}`);
            return await response.json();
        } catch (apiError) {
            // Existing fallback implementations...
            return { success: false, error: 'All sending methods failed' };
        }
    }

    /**
     * Determines the current application environment
     * @returns Current environment identifier
     */
    private static getCurrentEnvironment(): 'development' | 'preproduction' | 'production' {
        if (typeof window === 'undefined') return 'production';
        
        const hostname = window.location.hostname;
        if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) return 'development';
        if (hostname.includes('preproduction') || hostname.includes('test')) return 'preproduction';
        return 'production';
    }

    /**
     * Saves bug report to persistent storage for retry later
     * @param bugReport - Bug report to save
     */
    private static async savePendingReport(bugReport: IBugReport): Promise<void> {
        try {
        const pending = this.getPendingReports();
        pending.push({ ...bugReport, retryCount: 0 });
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pending));
        } catch (error) {
        console.error('Failed to save pending report:', error);
        }
    }

    private static getPendingReports(): Array<IBugReport & { retryCount: number }> {
        try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
        } catch {
        return [];
        }
    }

    /**
     * Resend pending reports
     */
    static async retryPendingReports(): Promise<void> 
    {
        const pending = this.getPendingReports();
        const successful: number[] = [];

        for (let i = 0; i < pending.length; i++) 
        {
            const report = pending[i];
            
            if (report.retryCount >= this.MAX_RETRIES) {
                continue; // Trop de tentatives
            }

            try {
                await this.sendBugReport(report);
                successful.push(i);
            } catch (error) {
                // Incrémente le compteur de retry
                pending[i].retryCount++;
            }

            // Petite pause entre les envois
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Supprime les rapports envoyés avec succès
        if (successful.length > 0) 
        {
            const updatedPending = pending.filter((_, index) => !successful.includes(index));
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPending));
        }
    }
}