import { YammerCopyOfMessageScenario } from './YammerCopyOfMessageScenario';

export class YammerDirectFollowerScenario extends YammerCopyOfMessageScenario {
    /**
     * Getter for the prefix for the datapoint event names that should be logged to track the Yammer Scenario
     */
    public getDatapointEventPrefix() {
        return 'YammerDirectFollower';
    }
}
