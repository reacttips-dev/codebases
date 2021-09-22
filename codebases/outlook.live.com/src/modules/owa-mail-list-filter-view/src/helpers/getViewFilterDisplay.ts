import { flaggedFilter } from 'owa-locstrings/lib/strings/flaggedfilter.locstring.json';
import { unreadFilter } from 'owa-locstrings/lib/strings/unreadfilter.locstring.json';
import { toMeFilter } from 'owa-locstrings/lib/strings/toMeFilter.locstring.json';
import { mentionsFilter } from 'owa-locstrings/lib/strings/mentionsFilter.locstring.json';
import { allFilter } from '../strings.locstring.json';
import { attachmentsLabel } from 'owa-locstrings/lib/strings/attachmentslabel.locstring.json';
import loc from 'owa-localize';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import { filesLabel } from './getViewFilterDisplay.locstring.json';

import { assertNever } from 'owa-assert';
import * as trace from 'owa-trace';

export default function getViewFilterDisplay(filter: ViewFilter): string {
    switch (filter) {
        case 'All':
            return loc(allFilter);
        case 'Unread':
            return loc(unreadFilter);
        case 'Flagged':
            return loc(flaggedFilter);
        case 'ToOrCcMe':
            return loc(toMeFilter);
        case 'HasAttachment':
            return loc(attachmentsLabel);
        case 'HasFile':
            return loc(filesLabel);
        case 'Mentioned':
            return loc(mentionsFilter);
        case 'TaskActive':
        case 'TaskOverdue':
        case 'TaskCompleted':
        case 'DeprecatedSuggestions':
        case 'DeprecatedSuggestionsRespond':
        case 'DeprecatedSuggestionsDelete':
        case 'DeprecatedNoClutter':
        case 'DeprecatedClutter':
        case 'SystemCategory':
        case 'UserCategory':
        case 'Pinned':
        case 'Focused':
        case 'Locked':
        case 'Hashtag':
        case 'Liked':
            trace.errorThatWillCauseAlert('Filter not implemented');
            return '';

        default:
            return assertNever(filter);
    }
}
