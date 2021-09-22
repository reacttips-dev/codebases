import { helpWidgetLoadFailMessage } from './loadMiniMavenHelpWidget.locstring.json';
import loc, { getCurrentCulture } from 'owa-localize';
import { getPaletteAsRawColors } from 'owa-theme';
import { getOwaResourceUrl } from 'owa-resource-url';
import * as HelpCharmConstants from '../utils/HelpCharmConstants';

import type { WidgetParams, ClientContext, MiniMavenTheme } from './../schema/MiniMavenOseFo';
import sendMiniMavenDataPoint from '../services/sendMiniMavenDataPoint';
import { getGuid } from 'owa-guid';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getSupportTicketMetaBlob } from '../utils/getSupportTicketMetaBlob';
import extractAndSendDiagnosticsInfoToODS from '../utils/extractAndSendDiagnosticsInfoToODS';

let onPaneDismiss: any;
let sessionId: string;
let widgetInitiationTime: number;
let widgetLoadFailTimeoutId: number;
let widgetPlaceholderDiv: HTMLDivElement;
let scriptElement;

export default function loadMiniMavenHelpWidget(hostingDivElement: HTMLDivElement, onDismiss: any) {
    if (hostingDivElement) {
        onPaneDismiss = onDismiss;
        widgetPlaceholderDiv = hostingDivElement;
        sessionId = getGuid();
        scriptElement = document.createElement('script');
        scriptElement.src = getOwaResourceUrl(HelpCharmConstants.OseFoScriptPath);

        let shouldDisableTicket = shouldDisableTicketFlow();
        let supportTicketMeta = getSupportTicketMetaBlob();

        scriptElement.onload = function () {
            var clientContext: ClientContext = {
                sessionId: sessionId,
                appId: HelpCharmConstants.WidgetAppId,
                locale: getCurrentCulture(),
                hideHeader: true,
                disableTicketFlow: shouldDisableTicket,
                theme: getUserTheme(),
                metadata: supportTicketMeta,
            };

            var widgetParams: WidgetParams = {
                hostingDiv: hostingDivElement,
                baseUrl: HelpCharmConstants.WidgetBaseUrl,
                clientContext: clientContext,
                widgetStyle: HelpCharmConstants.WidgetDefaultStyle,
                widgetEventListenerCallback: widgetEventListner,
            };

            widgetLoadFailTimeoutId = window.setTimeout(
                onWidgetLoadTimeout,
                HelpCharmConstants.MiniMavenWidgetLoadTimeOut
            );

            sendMiniMavenDataPoint({
                sessionId: sessionId,
                eventId: 'LaunchWidget',
                eventData: HelpCharmConstants.OwaMailEventData,
                loadTime: '',
                isDeeplinkScenario: '',
            });

            widgetInitiationTime = new Date().getTime();

            window.Osefo.CreateWidget(widgetParams);
        };

        document.head.appendChild(scriptElement);
    }
}

function getUserTheme(): MiniMavenTheme {
    // This uses `getPaletteAsRawColors()`, rather than `getPalette()`,
    // because the values (which may be CSS variable references) are being passed outside the
    // scope of the OWA client window
    let { themePrimary, themeDark } = getPaletteAsRawColors();

    let userTheme: MiniMavenTheme = {
        button: {
            bgColor: {
                onActive: themePrimary,
                onHover: themeDark,
            },
            borderColor: {
                onActive: themePrimary,
                onHover: themeDark,
            },
        },
        link: {
            color: {
                onActive: themePrimary,
                onHover: themeDark,
            },
        },
    };

    return userTheme;
}

function widgetEventListner(eventName: string) {
    // Widget dismiss event
    if (eventName == HelpCharmConstants.OsefoDismissWidgetEvent) {
        sendMiniMavenDataPoint({
            sessionId: sessionId,
            eventId: 'OnWidgetDismissEvent',
            eventData: HelpCharmConstants.OwaMailEventData,
            loadTime: '',
            isDeeplinkScenario: '',
        });

        onPaneDismiss();
    } else if (eventName == HelpCharmConstants.OsefoLoadWidgetEvent) {
        window.clearTimeout(widgetLoadFailTimeoutId);
        sendMiniMavenDataPoint({
            sessionId: sessionId,
            eventId: 'OnWidgetLoadEvent',
            eventData: HelpCharmConstants.OwaMailEventData,
            loadTime: String(new Date().getTime() - widgetInitiationTime),
            isDeeplinkScenario: '',
        });
    } else if (eventName.indexOf(HelpCharmConstants.OsefoTicketCreatedEvent) > -1) {
        extractAndSendDiagnosticsInfoToODS(eventName, sessionId);
    }
}

function onWidgetLoadTimeout() {
    widgetPlaceholderDiv.innerText = loc(helpWidgetLoadFailMessage);
    sendMiniMavenDataPoint({
        sessionId: sessionId,
        eventId: 'OnWidgetLoadFailEvent',
        eventData: HelpCharmConstants.OwaMailEventData,
        loadTime: String(new Date().getTime() - widgetInitiationTime),
        isDeeplinkScenario: '',
    });
}

function shouldDisableTicketFlow() {
    if (isFeatureEnabled('help-disableTicketFlow')) {
        // When the ticket flow is disabled by help-disableTicketFlow flight
        return true;
    } else {
        return false;
    }
}
