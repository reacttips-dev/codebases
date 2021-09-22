import getUserConfiguration from '../actions/getUserConfiguration';
import { isFeatureEnabled } from 'owa-feature-flags';

const DEFAULT_DURATION_FALLBACK = 30;

export default function getDefaultEventDuration(): number {
    let defaultEventDuration = DEFAULT_DURATION_FALLBACK;

    const userConfig = getUserConfiguration();
    if (
        isFeatureEnabled('cal-event-duration-setting') &&
        userConfig.UserOptions?.DefaultMeetingDuration
    ) {
        defaultEventDuration = userConfig
            ? userConfig.UserOptions.DefaultMeetingDuration
            : DEFAULT_DURATION_FALLBACK;
    }

    return defaultEventDuration;
}
