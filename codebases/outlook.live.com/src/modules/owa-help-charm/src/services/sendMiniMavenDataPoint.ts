import type Datapoint from 'owa-service/lib/contract/Datapoint';
import DatapointConsumer from 'owa-service/lib/contract/DatapointConsumer';
import logDatapointOperation from 'owa-service/lib/operation/logDatapointOperation';
import * as HelpCharmConstants from '../utils/HelpCharmConstants';

export interface MiniMavenDataPointProps {
    sessionId: string;
    eventId: string;
    loadTime: string;
    eventData: string;
    isDeeplinkScenario: string;
}

export default function sendMiniMavenDataPoint(
    datapointProps: MiniMavenDataPointProps
): Promise<boolean> {
    const keys: string[] = ['mmsid', 'mmeid', 'mmlt', 'mmed', 'mmidl'];

    let values: string[] = [
        datapointProps.sessionId,
        datapointProps.eventId,
        datapointProps.loadTime,
        datapointProps.eventData,
        datapointProps.isDeeplinkScenario,
    ];

    let miniMavenLogDatapoint: Datapoint = {
        Id: HelpCharmConstants.MiniMavenLogDatapointId,
        Consumers: DatapointConsumer.Analytics,
        Time: new Date(Date.now()).toString(),
        Keys: keys,
        Values: values,
    };

    return logDatapointOperation({ datapoints: [miniMavenLogDatapoint] });
}
