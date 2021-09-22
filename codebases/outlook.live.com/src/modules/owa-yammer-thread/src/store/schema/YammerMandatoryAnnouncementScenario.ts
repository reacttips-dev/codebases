import { YammerCopyOfMessageScenario } from './YammerCopyOfMessageScenario';

export class YammerMandatoryAnnouncementScenario extends YammerCopyOfMessageScenario {
    /**
     * Getter for the prefix for the datapoint event names that should be logged to track the Yammer Scenario
     */
    public getDatapointEventPrefix() {
        return 'YammerMandatoryAnnouncement';
    }
}
