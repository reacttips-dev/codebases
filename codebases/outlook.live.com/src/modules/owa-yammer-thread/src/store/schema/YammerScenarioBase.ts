import { logUsage } from 'owa-analytics';
import type YammerScenario from './YammerScenario';

// A valid Yammer Legacy Thread ID is one composed of only numbers
const INVALID_THREAD_ID_REGEX = new RegExp('[^0-9]');

export abstract class YammerScenarioBase implements YammerScenario {
    /**
     * Returns true if the string passed in is a valid Yammer Legacy Thread id
     * A valid legacy thread id is a string composed of numbers only
     * @param legacyThreadId (The id to be validated)
     */
    protected static isValidLegacyThreadId(legacyThreadId: string): boolean {
        const isValidId = !INVALID_THREAD_ID_REGEX.test(legacyThreadId);

        if (!isValidId) {
            logUsage('Yammer_InvalidId', { legacyThreadId }, { isCore: true });
        }

        return isValidId;
    }

    protected static parseScenarioDataString(dataString: string): { [key: string]: string } {
        if (!dataString) {
            return {};
        }

        // Current known formats are:
        // type=CopyOfMessage;messageId={messageId};threadId={threadId}
        // p=y;s=com;tid={legacy thread id}
        // p=y;s=com;threadid={graphql thread id}
        // p=y;s=dd;tl={comma separated list of legacy thread ids}
        // p=y;s=dd;threadids={comma separated list of graphql thread ids}
        // p=y;s=df;tl={comma separated list of legacy thread ids}
        // p=y;s=df;threadids={comma separated list of graphql thread ids}
        //
        // This list includes legacy thread id and graphql thread id.
        // Legacy ids are numeric while the graphql ids are base64 encoded and contain the
        // legacy id and a type that describes the entity represented by the legacy id.
        // We are moving from legacy to graphql ids so after a transition period we will remove
        // the code related to legacy id and keep the graphql id handler only.
        const dataPropsString = dataString.split(';');
        let dataProps: { [key: string]: string } = {};
        for (let i = 0; i < dataPropsString.length; i++) {
            const dataProp = dataPropsString[i].split('=', 2);
            if (dataProp.length != 2) {
                continue;
            }

            dataProps[dataProp[0]] = dataProp[1];
        }

        return dataProps;
    }

    /**
     * Getter for the prefix for the datapoint event names that should be logged to track the Yammer Scenario
     */
    abstract getDatapointEventPrefix(): string;

    /**
     * Getter for the data associated with the instance of the Yammer Scenario
     */
    abstract getScenarioData(): any;

    /**
     * Returns true if the instance of the Yammer Scenario contains valid data, false otherwise
     */
    abstract isValid(): boolean;
}
