import { logUsage } from 'owa-analytics';

export function logFmsActionClick(requestId: string) {
    logUsage('FmsClickEvent', [requestId], { isCore: true });
}
