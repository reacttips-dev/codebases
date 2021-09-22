import speedyMeetingsBaseCardProps from './SpeedyMeetingsBaseCard';
import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function shortenEventsDurationCardProps(): WhatsNewCardProperty {
    return speedyMeetingsBaseCardProps(
        WhatsNewCardIdentity.ShortenEventsDuration,
        'shortenEventsOption',
        () => Promise.resolve(!isFeatureEnabled('cal-mf-shortenEventsDuration'))
    );
}
