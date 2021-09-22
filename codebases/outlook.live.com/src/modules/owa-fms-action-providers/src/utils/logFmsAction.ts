import { logUsage } from 'owa-analytics';

export function logFmsAction(
    invokedBy: string,
    requestId: string,
    actionFilter: string,
    isActionReturned: boolean
) {
    logUsage('FmsAction', [invokedBy, requestId, actionFilter, isActionReturned], { isCore: true });
}
