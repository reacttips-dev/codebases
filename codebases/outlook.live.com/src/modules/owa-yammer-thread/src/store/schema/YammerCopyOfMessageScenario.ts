import { YammerScenarioBase } from './YammerScenarioBase';

export class YammerCopyOfMessageScenario extends YammerScenarioBase {
    threadId: string;
    legacyThreadId: string;

    constructor(extensibleContentData: string, yammerNotificationData: string) {
        super();
        this.setScenarioData(extensibleContentData, yammerNotificationData);
    }

    /**
     * Returns a string representing a Yammer Thread Id
     * @param extensibleContentData (The value in the ClientItem's ExtensibleContentData property)
     */
    private parseExtensibleContentData(extensibleContentData: string) {
        const dataProps = YammerScenarioBase.parseScenarioDataString(extensibleContentData);

        if (dataProps['tid']) {
            this.legacyThreadId = dataProps['tid'];
        } else if (dataProps['threadid']) {
            this.threadId = dataProps['threadid'];
        }
    }

    /**
     * Returns a string representing a Yammer Thread Id
     * @param yammerNotificationString (The value in the ClientItem's YammerNotification property)
     */
    private parseYammerNotification(yammerNotificationString: string) {
        const notificationProps = YammerScenarioBase.parseScenarioDataString(
            yammerNotificationString
        );
        const parsedThreadId = notificationProps['threadId'];
        if (parsedThreadId && notificationProps['type'] == 'CopyOfMessage') {
            this.legacyThreadId = parsedThreadId;
        }
    }

    /**
     * Sets the scenario data based on the string passed in
     * @param extensibleContentData (The value in the ClientItem's ExtensibleContentData property)
     * @param yammerNotificationData (The value in the ClientItem's YammerNotification property)
     */
    private setScenarioData(extensibleContentData: string, yammerNotificationData: string) {
        if (extensibleContentData) {
            this.parseExtensibleContentData(extensibleContentData);
        }

        if (!this.isValid() && yammerNotificationData) {
            // If we couldn't extract the threadId when parsing the extensibleContentData, we will
            // try to parse the yammerNotificationData
            this.parseYammerNotification(yammerNotificationData);
        }
    }

    /**
     * Getter for the prefix for the datapoint event names that should be logged to track the Yammer Scenario
     */
    public getDatapointEventPrefix() {
        return 'YammerCopyOfMessage';
    }

    /**
     * Getter for the data associated with the instance of the Yammer Copy of Message Scenario
     */
    public getScenarioData() {
        return this.legacyThreadId ?? this.threadId;
    }

    /**
     * Returns true if the instance of the Yammer Copy of Message Scenario contains valid data, false otherwise
     */
    public isValid() {
        if (this.threadId) {
            return true;
        }

        if (this.legacyThreadId) {
            return YammerScenarioBase.isValidLegacyThreadId(this.legacyThreadId);
        }

        return false;
    }
}
