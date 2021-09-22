import { CompetitiveTrackerService } from "services/competitiveTracker/competitiveTrackerService";
import { ETrackerType, ICompetitiveTrackerServiceUtils } from "services/competitiveTracker/types";

const generateTrackerNameInner = (name, index = 1) => {
    const trackerName = `${name} (${index})`;
    if (!isTrackerNameUsed(trackerName)) {
        return trackerName;
    }
    return generateTrackerNameInner(name, index + 1);
};

const isTrackerNameUsed = (name) => {
    const trackers = CompetitiveTrackerService.get();
    const isTrackerNameUsed = trackers.some(({ name: trackerName }) => trackerName === name);
    return isTrackerNameUsed;
};

const generateTrackerName = (name) => {
    if (!isTrackerNameUsed(name)) {
        return name;
    }
    return generateTrackerNameInner(name);
};

const hasTrackers = (type = ETrackerType.Research) => {
    const trackers = CompetitiveTrackerService.get(type);
    return trackers.length > 0;
};

export const CompetitiveTrackerServiceUtils: ICompetitiveTrackerServiceUtils = {
    generateTrackerName,
    hasTrackers,
};
