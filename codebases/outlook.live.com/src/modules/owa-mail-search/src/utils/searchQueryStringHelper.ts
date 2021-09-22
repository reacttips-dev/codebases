import { format } from 'owa-localize';
import { PeopleSearchPrefix } from '../store/schema/PeopleSearchPrefix';

import {
    TO_PREFIX,
    FROM_PREFIX,
    CC_PREFIX,
    PARTICIPANTS_PREFIX,
    PARENTHESIS_FORMAT_STRING,
} from '../searchConstants';

export function createFormattedStringWithPrefix(rawString: string, prefix: PeopleSearchPrefix) {
    const prefixString = (() => {
        if (prefix == PeopleSearchPrefix.From) {
            return FROM_PREFIX;
        } else if (prefix == PeopleSearchPrefix.To) {
            return TO_PREFIX;
        } else if (prefix == PeopleSearchPrefix.CC) {
            return CC_PREFIX;
        } else if (prefix == PeopleSearchPrefix.Participants) {
            return PARTICIPANTS_PREFIX;
        } else {
            throw new Error('Invalid PeopleSearchPrefix value');
        }
    })();

    return format(prefixString, format(PARENTHESIS_FORMAT_STRING, rawString));
}
