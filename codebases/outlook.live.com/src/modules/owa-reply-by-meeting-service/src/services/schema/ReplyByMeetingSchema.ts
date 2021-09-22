interface ReplyByMeetingRequest {
    ReferenceItemId: string;
    ShouldSend?: boolean;
    Event?: RestEvent;
}
export default ReplyByMeetingRequest;

export interface RestEvent {
    Start?: DateTimeTimeZone;
    End?: DateTimeTimeZone;
    Location?: Location;
    Body?: ItemBody;
    ReminderMinutesBeforeStart?: number;
}

export interface DateTimeTimeZone {
    DateTime: string;
    TimeZone: string;
}

export interface Location {
    DisplayName: string;
}

export interface ReplyByMeetingResponse {
    CreatedEventId: string;
}

export interface ItemBody {
    Content: string;
    ContentType: ContentType;
}

export enum ContentType {
    Text,
    Html,
}
