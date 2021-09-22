import { NudgedReason } from 'owa-mail-nudge-store';
import { trace } from 'owa-trace';

export default function getNudgedReasonFromResponse(reason: string): NudgedReason {
    switch (reason) {
        case 'Received':
            return NudgedReason.ReceivedDaysAgo;
        case 'Sent':
            return NudgedReason.SentDaysAgo;
        default:
            trace.warn('No nudge reason returned in GetNudge server response');
            return NudgedReason.ReceivedDaysAgo;
    }
}
