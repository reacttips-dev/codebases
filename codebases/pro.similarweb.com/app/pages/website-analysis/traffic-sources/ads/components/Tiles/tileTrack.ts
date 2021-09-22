import { allTrackers } from "services/track/track";
export const trackCreativeImageClick = (url) => {
    allTrackers.trackEvent("expand", "click", url);
};

export const trackCampaignVisit = (url) => {
    allTrackers.trackEvent("external link", "click", url);
};

export const trackCreativeVideoClick = (url) => {
    allTrackers.trackEvent("external link", "click", url);
};
