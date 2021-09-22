import speedyMeetingsBaseCardProps from './SpeedyMeetingsBaseCard';
import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function speedyMeetingsCardProps(): WhatsNewCardProperty {
    return speedyMeetingsBaseCardProps(
        WhatsNewCardIdentity.SpeedyMeetings,
        'speedyMeetingsOption',
        () =>
            Promise.resolve(
                !isFeatureEnabled('cal-mf-shouldEventsEndEarlySetting') ||
                    isFeatureEnabled('cal-mf-shortenEventsDuration')
            )
    );
}
