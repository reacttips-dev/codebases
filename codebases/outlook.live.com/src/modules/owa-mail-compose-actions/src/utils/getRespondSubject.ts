import {
    replySubjectPrefix,
    forwardSubjectPrefix,
    approveSubjectPrefix,
    rejectSubjectPrefix,
} from './getRespondSubject.locstring.json';
import loc, { format } from 'owa-localize';
import getExtendedPropertyValue from 'owa-mail-store/lib/utils/getExtendedPropertyValue';
import { ComposeOperation } from 'owa-mail-compose-store';
import type Item from 'owa-service/lib/contract/Item';

const NORMALIZED_SUBJECT_PROPERTY_TAG = '0xe1d';

export default function getRespondSubject(item: Item, composeOperation: ComposeOperation): string {
    const normalizedSubject =
        (getExtendedPropertyValue(item, NORMALIZED_SUBJECT_PROPERTY_TAG) as string) ||
        item.Subject ||
        '';

    const prefix = getRespondSubjectPrefix(composeOperation).trim();

    return format('{0} {1}', prefix, normalizedSubject);
}

function getRespondSubjectPrefix(composeOperation: ComposeOperation): string {
    switch (composeOperation) {
        case ComposeOperation.Reply:
        case ComposeOperation.ReplyAll:
            return loc(replySubjectPrefix);
        case ComposeOperation.Forward:
            return loc(forwardSubjectPrefix);
        case ComposeOperation.Approve:
            return loc(approveSubjectPrefix);
        case ComposeOperation.Reject:
            return loc(rejectSubjectPrefix);
        default:
            return '';
    }
}
