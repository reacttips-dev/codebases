import {
  MAFIA_RESPONSE_ID,
  MAFIA_SESSION_ID,
  MAFIA_SESSION_TOKEN,
  MAFIA_UBID_MAIN
} from 'constants/apis';
import { recordToSplunk } from 'apis/checkout';
import { buildErrorQueryString } from 'helpers/CheckoutUtils';

export function sessionLoggerMiddleware(response, cookies) {
  const { headers } = response;
  if (cookies && headers) {
    const { 'session-id': sessionId, 'ubid-main': ubidMain, 'session-token': sessionToken } = cookies;
    const responseUbidMain = headers.get(MAFIA_UBID_MAIN);
    const responseSessionId = headers.get(MAFIA_SESSION_ID);
    const responseSessionToken = headers.get(MAFIA_SESSION_TOKEN);
    const responseResponseId = headers.get(MAFIA_RESPONSE_ID);
    const sessionIdFlipped = sessionId && responseSessionId && sessionId !== responseSessionId;
    const sessionTokenFlipped = sessionToken && responseSessionToken && sessionToken !== responseSessionToken;
    const ubidMainFlipped = ubidMain && responseUbidMain && ubidMain !== responseUbidMain;
    const params = {
      sessionId,
      responseSessionId,
      sessionToken,
      responseSessionToken,
      ubidMain,
      responseUbidMain,
      responseId: responseResponseId
    };

    if (sessionIdFlipped || sessionTokenFlipped || ubidMainFlipped) {
      const debugString = buildErrorQueryString('sessionLog', params);
      recordToSplunk(debugString);
    }
  }

  return response;
}
