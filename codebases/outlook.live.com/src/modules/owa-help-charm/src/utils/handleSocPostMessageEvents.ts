import { lazyLaunchInAppFeedback } from 'owa-uservoice';
import { getSupportTicketMetaBlob } from '../utils/getSupportTicketMetaBlob';
import { trace } from 'owa-trace';
import * as HelpCharmConstants from '../utils/HelpCharmConstants';
import extractAndSendDiagnosticsInfoToODS from '../utils/extractAndSendDiagnosticsInfoToODS';
import { getGuid } from 'owa-guid';
import { isConsumer } from 'owa-session-store';

const invokeFeedbackEvent = 'InvokeFeedback';
const requestMetadataEvent = 'RequestMetadata';

export default function handleSocPostMessageEvents(messageEvent: any) {
    let socOriginUrl = isConsumer()
        ? 'https://support.office.live.com'
        : 'https://support.office.com';
    if (messageEvent.origin == socOriginUrl) {
        trace.info('Soc post message event: ' + messageEvent.data);
        if (messageEvent.data == invokeFeedbackEvent) {
            lazyLaunchInAppFeedback.importAndExecute();
        } else if (messageEvent.data == requestMetadataEvent) {
            let supportTicketMetaBlob = getSupportTicketMetaBlob();
            messageEvent.source.postMessage(supportTicketMetaBlob, socOriginUrl);
        } else if (
            typeof messageEvent.data === 'string' &&
            messageEvent.data.indexOf(HelpCharmConstants.OsefoTicketCreatedEvent) > -1
        ) {
            extractAndSendDiagnosticsInfoToODS(messageEvent.data, getGuid());
        }
    }
}
