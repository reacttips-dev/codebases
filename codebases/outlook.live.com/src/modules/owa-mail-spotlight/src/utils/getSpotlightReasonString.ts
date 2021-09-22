import {
    spotlightReasonActionRequired,
    spotlightReasonAffectsSchedule,
    spotlightReasonAtMentioned,
    spotlightReasonMeetingCanceled,
    spotlightReasonNewMeetingCreated,
    spotlightReasonNewMeetingTimeProposed,
    spotlightReasonNone,
    spotlightReasonUpcomingMeetingTimeChanged,
    spotlightReasonReplyToEmail,
    spotlightReasonUltraFocused,
} from './getSpotlightReasonString.locstring.json';
import SpotlightReason from '../store/schema/SpotlightReason';
import loc from 'owa-localize';

export default function getSpotlightReasonString(spotlightReason: SpotlightReason): string {
    switch (spotlightReason) {
        case SpotlightReason.ActionRequired:
            return loc(spotlightReasonActionRequired);
        case SpotlightReason.AffectsSchedule:
            return loc(spotlightReasonAffectsSchedule);
        case SpotlightReason.AtMentioned:
            return loc(spotlightReasonAtMentioned);
        case SpotlightReason.NewMeetingCreated:
            return loc(spotlightReasonNewMeetingCreated);
        case SpotlightReason.UpcomingMeetingTimeChanged:
            return loc(spotlightReasonUpcomingMeetingTimeChanged);
        case SpotlightReason.MeetingCanceled:
            return loc(spotlightReasonMeetingCanceled);
        case SpotlightReason.NewMeetingTimeProposed:
            return loc(spotlightReasonNewMeetingTimeProposed);
        case SpotlightReason.UltraFocused:
            return loc(spotlightReasonUltraFocused);
        case SpotlightReason.ReplyToYourEmail:
            return loc(spotlightReasonReplyToEmail);
        case SpotlightReason.ReplyRequired:
        case SpotlightReason.None:
        case SpotlightReason.TestMessage:
        default:
            return loc(spotlightReasonNone);
    }
}
