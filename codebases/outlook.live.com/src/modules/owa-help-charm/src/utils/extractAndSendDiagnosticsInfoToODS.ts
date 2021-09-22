import { format } from 'owa-localize';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import sendMiniMavenDataPoint from '../services/sendMiniMavenDataPoint';
import trace from 'owa-trace/lib/trace';

import * as HelpCharmConstants from '../utils/HelpCharmConstants';
import sendDiagnosticsToODS from '../services/sendDiagnosticsToODS';
import type { ODSDiagnosticsResponse } from '../schema/ODSDiagnosticsResponse';
import { isSuccessStatusCode } from 'owa-http-status-codes';

export default function extractAndSendDiagnosticsInfoToODS(
    eventNameWithTicketId: string,
    sessionId: string
) {
    // If its ticket creation event
    // Post ticket id with PUID to ODS for GDPR
    let ticketIdArr: string[] = eventNameWithTicketId.split('-');
    if (ticketIdArr.length > 1) {
        let userConfig = getUserConfiguration();
        sendDiagnosticsToODS({
            TenantId: userConfig.SessionSettings.TenantGuid,
            TicketId: ticketIdArr[1],
            TicketTier: HelpCharmConstants.ODSTicketTier,
            UserPuid: userConfig.SessionSettings.UserPuid,
            SessionId: sessionId,
        })
            .then(response => {
                if (!isSuccessStatusCode(response.status)) {
                    let errorString = `POST request to ${HelpCharmConstants.ODSServiceEndpoint} failed, http error:${response.status}`;
                    throw new Error(errorString);
                } else {
                    response.json().then((responseJson: ODSDiagnosticsResponse) => {
                        trace.info(
                            format(
                                'ODS SessionId {0} TicketId {1}',
                                responseJson.DiagnosticSessionId,
                                responseJson.TicketId
                            )
                        );
                    });
                }
            })
            .catch((error: Error) => {
                const odsEventData = {
                    Error: error.message,
                    TenantId: userConfig.SessionSettings.TenantGuid,
                    TicketId: ticketIdArr[1],
                    UserPuid: userConfig.SessionSettings.UserPuid,
                };

                sendMiniMavenDataPoint({
                    sessionId: sessionId,
                    eventId: 'ODSFailEvent',
                    eventData: JSON.stringify(odsEventData),
                    loadTime: '',
                    isDeeplinkScenario: '',
                });
            });
    }
}
