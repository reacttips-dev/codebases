import type { WhatsNewCardIdentity } from '../store/schema/WhatsNewCardIdentity';
import { logUsage } from 'owa-analytics';

function logDatapoint(identity: WhatsNewCardIdentity, event: string) {
    let isExp = false;
    logUsage(event, [identity, isExp]);
}

export function logWhatsNewCardRead(identity: WhatsNewCardIdentity): void {
    logDatapoint(identity, 'whatsNewCardRead');
}

export function logWhatsNewCardButtonClicked(identity: WhatsNewCardIdentity): void {
    logDatapoint(identity, 'whatsNewCardButtonClicked');
}

export function logWhatsNewCardShown(identity: WhatsNewCardIdentity): void {
    logDatapoint(identity, 'whatsNewCardShown');
}

export function logWhatsNewCalloutShown(identity: WhatsNewCardIdentity): void {
    logDatapoint(identity, 'whatsNewCalloutShown');
}
