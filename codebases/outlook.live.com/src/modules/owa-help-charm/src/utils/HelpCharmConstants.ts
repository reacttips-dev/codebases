import type { WidgetStyle } from './../schema/MiniMavenOseFo';

export const OseFoScriptPath = 'resources/scripts/osefo.js';
export const WidgetAppId = 'RXOWA';
export const WidgetDefaultStyle: WidgetStyle = {
    bottom: '0',
    left: '0',
    height: '100%',
    width: '100%',
    position: 'absolute',
};

export const WidgetBaseUrl = 'https://concierge.live.com';
export const OsefoInitWidgetEvent = 'OsefoInitWidget';
export const OsefoLoadWidgetEvent = 'OsefoLoadWidget';
export const OsefoDismissWidgetEvent = 'OsefoDismissWidget';
export const OsefoTicketCreatedEvent = 'TicketCreated';
export const NotApplicableConstant = 'N/A';
export const MiniMavenLogDatapointId = 'MiniMavenDataPoint';
export const MiniMavenWidgetLoadTimeOut = 30000;
export const OwaMailEventData = 'Owa Mail';
export const ODSServiceEndpoint = 'https://api.diagnostics.office.com/v1/diagnosticsession';
export const ODSTicketTier = 'OWAHelpshift';
export const bytesToMb: number = 1024 * 1024;
