import {
    allTrackers,
    googleTracker,
    healthChecks,
    init,
    intercomTracker,
    mixpanelTracker,
    munchkinTracker,
    piwikTracker,
    trackPageViewWithCustomUrl,
} from "services/track/track";
import {
    isJacoRecording,
    isJacoRunning,
    setRecordingStatus,
    startJacoRecorder,
    stopJacoRecorder,
} from "services/plugins/JacoPlugin";
import { openSurvey } from "services/plugins/WebEngagePlugin";

export const SwTrack = {
    google: googleTracker,
    piwik: piwikTracker,
    munchkin: munchkinTracker,
    intercom: intercomTracker,
    mixpanel: mixpanelTracker,
    all: allTrackers,
    healthChecks,
    trackPageView: trackPageViewWithCustomUrl,
    isJacoRunning,
    isJacoRecording,
    startJacoRecorder,
    stopJacoRecorder,
    setRecordingStatus,
    openSurvey,
    get buffer() {
        return piwikTracker.getTrackers()[0].getBuffer();
    },
    init,
};
