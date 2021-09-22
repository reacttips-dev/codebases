import {
    nudgeReasonReceivedDaysAgo,
    nudgeReasonSentDaysAgo,
    nudgeReasonReceivedToday,
    nudgeReasonSentToday,
    nudgeReasonReceivedOneDayAgo,
    nudgeReasonSentOneDayAgo,
} from './getNudgedReason.locstring.json';
import loc, { format } from 'owa-localize';
import NudgedReason from '../store/schema/NudgedReason';
import nudgeStore from '../store/Store';

export default function getNudgedReason(rowKey: string): string {
    const nudgedRow = nudgeStore.nudgedRows.filter(nudgedRow => nudgedRow.rowKey === rowKey)[0];
    const ageInDays = nudgedRow.daysAgo;
    const isReplyNudge = nudgedRow.reason == NudgedReason.ReceivedDaysAgo;

    if (ageInDays == 0) {
        return isReplyNudge ? loc(nudgeReasonReceivedToday) : loc(nudgeReasonSentToday);
    }

    if (ageInDays == 1) {
        return isReplyNudge ? loc(nudgeReasonReceivedOneDayAgo) : loc(nudgeReasonSentOneDayAgo);
    }

    return isReplyNudge
        ? format(loc(nudgeReasonReceivedDaysAgo), ageInDays)
        : format(loc(nudgeReasonSentDaysAgo), ageInDays);
}
