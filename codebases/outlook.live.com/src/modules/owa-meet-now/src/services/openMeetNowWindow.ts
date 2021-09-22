import {
    MEET_NOW_OWS_SERVICE_PATH,
    SKYPE_CONSUMER_MEET_NOW_URI,
    LOADING_STATIC_PAGE,
    LOADING_PAGE_TEXT_ID,
    LOADING_PAGE_SPINNER_ID,
} from '../constants/MeetNowConstants';
import type { PerformanceDatapoint } from 'owa-analytics';
import { getGuid } from 'owa-guid';
import { HttpStatusCode, isSuccessStatusCode } from 'owa-http-status-codes';
import loc, { format } from 'owa-localize';
import { makePostRequest } from 'owa-ows-gateway';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import * as trace from 'owa-trace';
import {
    meetNowMeetingSubject,
    meetNowMeetingOpening,
    meetNowMeetingRecoverableError,
    meetNowMeetingPolicyError,
} from '../constants/MeetNowStrings.locstring.json';
import {
    startPerformanceDatapoint,
    logMeetNowError,
    logMeetNowSuccess,
    MeetNowClientErrorTypes,
} from '../telemetry/meetNowLogging';

import ERROR_STATE from 'owa-empty-state/lib/svg/gray/loadingError.svg';

export type ScenarioName = 'SuiteHeader' | 'ModuleSwitcher';

export default async function openMeetNowWindow(scenario: ScenarioName) {
    const corrGuid = getGuid();
    const datapoint = startPerformanceDatapoint(corrGuid, scenario);
    if (isConsumer()) {
        window.open(
            SKYPE_CONSUMER_MEET_NOW_URI + '?exp=' + scenario + '&correlationId=' + corrGuid
        );
        logMeetNowSuccess(datapoint, true /* isConsumer */);
        return;
    }
    const newWindow = window.open();
    if (!newWindow) {
        postErrorCleanUp(datapoint, MeetNowClientErrorTypes.NoWindowObject, newWindow);
        return;
    }
    // eslint-disable-next-line @microsoft/sdl/no-document-write
    newWindow.document.write(LOADING_STATIC_PAGE);
    const textContainer = newWindow.document.getElementById(LOADING_PAGE_TEXT_ID);
    if (textContainer) {
        textContainer.innerText = loc(meetNowMeetingOpening);
    }
    const subject = format(
        loc(meetNowMeetingSubject),
        getUserConfiguration().SessionSettings?.UserDisplayName
    );
    try {
        const response = await makePostRequest(
            MEET_NOW_OWS_SERVICE_PATH,
            { Subject: subject },
            corrGuid,
            true /* returnFullResponse */,
            undefined /* customHeaders */,
            true /* throwServiceError */,
            undefined /* sendPayloadAsBody */,
            true /* includeCredentials */
        );
        if (response) {
            const responseText = await response.text();
            if (isSuccessStatusCode(response.status)) {
                const responseBody = responseText ? JSON.parse(responseText) : undefined;
                if (responseBody?.meetingUrl) {
                    if (newWindow) {
                        const laEntry = scenario === 'SuiteHeader' ? 'header' : 'left_rail';
                        // Because Teams was delayed in adding support for the various query string parameters,
                        // We are hacking around their limitations by using a launch agent that includes the scenario.
                        // This code should be removed some time in November 2020 once Teams fully launches support.
                        const tempLaunchAgent = 'OWA_' + scenario;
                        const newMeetingUrl =
                            responseBody.meetingUrl +
                            `&launchAgent=${tempLaunchAgent}&isMeetingCreation=true&correlationId=${corrGuid}&laEntry=${laEntry}`;
                        newWindow.location.href = newMeetingUrl;

                        logMeetNowSuccess(datapoint, false /* isConsumer */);
                    } else {
                        postErrorCleanUp(
                            datapoint,
                            MeetNowClientErrorTypes.NoWindowObject,
                            newWindow
                        );
                    }
                } else {
                    postErrorCleanUp(
                        datapoint,
                        MeetNowClientErrorTypes.NoMeetingUrlInResponse,
                        newWindow
                    );
                }
            } else {
                if (response.statusCode == HttpStatusCode.Forbidden) {
                    // We should do something more special here.
                    // MeetNowForbidden state means it's an unrecoverable error and we should disable MeetNow.
                    postErrorCleanUp(
                        datapoint,
                        MeetNowClientErrorTypes.MeetNowForbidden,
                        newWindow,
                        responseText
                    );
                } else {
                    postErrorCleanUp(
                        datapoint,
                        MeetNowClientErrorTypes.NonSuccessStatusCodeResponse,
                        newWindow,
                        responseText
                    );
                }
            }
        } else {
            postErrorCleanUp(datapoint, MeetNowClientErrorTypes.UndefinedResponse, newWindow);
        }
    } catch (ex) {
        postErrorCleanUp(datapoint, MeetNowClientErrorTypes.MakePostRequestError, newWindow, ex);
    }
}

function postErrorCleanUp(
    datapoint: PerformanceDatapoint,
    errorType: MeetNowClientErrorTypes,
    newWindow: Window | null,
    errorObject?: any
) {
    logMeetNowError(datapoint, errorType, errorObject);
    if (newWindow) {
        const spinner = newWindow.document.getElementById(LOADING_PAGE_SPINNER_ID);
        const newImg = newWindow.document.createElement('img');
        newImg.src = ERROR_STATE;
        spinner?.parentNode?.replaceChild(newImg, spinner);
        const textContainer = newWindow.document.getElementById(LOADING_PAGE_TEXT_ID);
        const errorString = MeetNowClientErrorTypes.MeetNowForbidden
            ? loc(meetNowMeetingPolicyError)
            : loc(meetNowMeetingRecoverableError);
        if (textContainer) {
            textContainer.innerText = errorString;
        }
    }
    trace.debugErrorThatWillShowErrorPopupOnly(
        'Error opening MeetNow meeting: ' + MeetNowClientErrorTypes[errorType],
        errorObject
    );
}
