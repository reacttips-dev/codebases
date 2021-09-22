// DO NOT CHANGE THIS ORDERING. It is being used for telemetry.
export enum SonoraEntityType {
    File = 0,
    StickyNotes = 1,
    MeetingTimes = 2,
    VivaTopicFile = 3,
    VivaTopicPerson = 4,
    VivaTopicEntity = 5,
    Contact = 6,
}

export default interface SonoraItem {
    type: SonoraEntityType;
}
