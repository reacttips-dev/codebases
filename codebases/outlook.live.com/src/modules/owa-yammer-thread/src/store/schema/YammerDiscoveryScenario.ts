import { YammerMultiThreadScenarioBase } from './YammerMultiThreadScenarioBase';

export class YammerDiscoveryScenario extends YammerMultiThreadScenarioBase {
    /**
     * Getter for the prefix for the datapoint event names that should be logged to track the Yammer Scenario
     */
    public getDatapointEventPrefix() {
        return 'YammerDiscovery';
    }
}
