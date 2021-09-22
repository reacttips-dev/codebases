import { updateBindStatus } from '../mutators/updateBindStatus';
import { logUsage } from 'owa-analytics';

export function completeLinkedInBind(error: string): void {
    logUsage('linkedInBindComplete', [error]);
    updateBindStatus(error ? 'Unbound' : 'Bound');
}
