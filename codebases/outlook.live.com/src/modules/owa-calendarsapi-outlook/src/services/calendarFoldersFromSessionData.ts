import type GetCalendarFoldersResponse from 'owa-service/lib/contract/GetCalendarFoldersResponse';
import type { SessionData } from 'owa-service/lib/types/SessionData';

let responseFromSessionData: GetCalendarFoldersResponse;

export function stashCalendarFoldersFromSessionData(
    sessionData: SessionData | undefined
): SessionData {
    responseFromSessionData = sessionData?.getCalendarFolders;
    return sessionData;
}

export function getCalendarFoldersFromSessionData(): GetCalendarFoldersResponse {
    let response = responseFromSessionData;
    responseFromSessionData = undefined;
    return response;
}
