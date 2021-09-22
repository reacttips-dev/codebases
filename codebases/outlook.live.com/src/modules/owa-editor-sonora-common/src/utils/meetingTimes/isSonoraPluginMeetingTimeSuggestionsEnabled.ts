import { isFeatureEnabled } from 'owa-feature-flags';

export default function isSonoraPluginMeetingTimeSuggestionsEnabled(): boolean {
    return isFeatureEnabled('honeybee-sonora-meetingTime');
}
