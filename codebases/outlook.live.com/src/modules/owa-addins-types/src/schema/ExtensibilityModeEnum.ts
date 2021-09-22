export enum ExtensibilityModeEnum {
    Unknown = 0,
    AppointmentOrganizer = 1,
    AppointmentAttendee = 2,
    MessageCompose = 3,
    MessageRead = 4,
    MeetingRequest = 5,
    DetectedEntity = 7,
    Events = 8,
    LaunchEvent = 9,

    // Deprecated:
    TrapOnSendEvent = 6,
}

export default ExtensibilityModeEnum;
