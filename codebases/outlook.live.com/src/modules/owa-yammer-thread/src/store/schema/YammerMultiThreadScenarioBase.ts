import { YammerScenarioBase } from './YammerScenarioBase';

export abstract class YammerMultiThreadScenarioBase extends YammerScenarioBase {
    threadIds: string[];
    legacyThreadIds: string[];
    emailId: string;
    activationCode: string;

    constructor(dataString: string) {
        super();
        this.setScenarioData(dataString);
    }

    /**
     * Returns true if all values in the legacy thread id array are valid Yammer Thread ids
     * A valid legacy id is a string composed of numbers only
     */
    private isValidLegacyThreadIdArray(): boolean {
        if (!this.legacyThreadIds) {
            return false;
        }

        let isValid = true;
        this.legacyThreadIds.forEach(
            legacyThreadId =>
                (isValid = isValid && YammerScenarioBase.isValidLegacyThreadId(legacyThreadId))
        );

        return isValid;
    }

    /**
     * Sets the scenario data based on the extensibleContentData passed in
     * @param dataString (The string to be parsed to extract the scenario data)
     */
    private setScenarioData(dataString: string) {
        const dataProps = YammerScenarioBase.parseScenarioDataString(dataString);

        if (dataProps['tl']) {
            this.legacyThreadIds = dataProps['tl'].split(',');
        } else if (dataProps['threadids']) {
            this.threadIds = dataProps['threadids'].split(',');
        }

        if (dataProps['eid']) {
            this.emailId = dataProps['eid'];
        }

        if (dataProps['ac']) {
            this.activationCode = dataProps['ac'];
        }
    }

    /**
     * Getter for the data associated with the instance of the Yammer Discovery Scenario
     */
    public getScenarioData() {
        return this.legacyThreadIds ?? this.threadIds;
    }

    /**
     * Returns true if the instance of the Yammer Discovery Scenario contains valid data, false otherwise
     */
    public isValid() {
        if (this.threadIds) {
            return true;
        }

        return this.isValidLegacyThreadIdArray();
    }

    /**
     * Getter for the prefix for the datapoint event names that should be logged to track the Yammer Scenario
     */
    abstract getDatapointEventPrefix(): string;
}
