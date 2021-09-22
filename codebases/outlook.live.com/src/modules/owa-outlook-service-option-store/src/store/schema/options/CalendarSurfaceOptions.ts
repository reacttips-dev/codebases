import type OwsOptionsBase from '../OwsOptionsBase';

// The shape is defined on the server, and should be kept in sync
// In the server-ows-api project: src/Microsoft.OWS.UserSettings/Models/OutlookOptions/OptionsTypes/CalendarSurfaceOptions.cs
interface CalendarSurfaceOptions extends OwsOptionsBase {
    agendaPaneIsClosed: boolean;
    lastKnownRoamingTimeZone: string;
    roamingTimeZoneNotificationsIsDisabled: boolean;
    allDayWellHeight: number;
    numDaysInDayRange: number;
    workLifeView: number; // bitmap representation of applicable flags from WorkLifeViewOptionFlags
}

export enum WorkLifeViewOptionFlags {
    Work = 1,
    Life = 2,
}

export default CalendarSurfaceOptions;
