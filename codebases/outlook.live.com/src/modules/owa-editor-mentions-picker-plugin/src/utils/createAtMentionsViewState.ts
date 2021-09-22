import type { AtMentionsViewState } from '../store/schema/AtMentionsViewState';
import { DirectorySearchType } from 'owa-recipient-types/lib/types/FindControlViewState';
import createPickerPluginViewState from 'owa-editor-picker-plugin/lib/utils/createPickerPluginViewState';

export default function createAtMentionsViewState(
    pendingSocialActivityTags: string[]
): AtMentionsViewState {
    const viewState = <AtMentionsViewState>{
        ...createPickerPluginViewState(),
        queryString: '',
        wordBeforeCursor: '',
        findResultSet: [],
        selectedRecipientIndex: 0,
        isSearching: false,
        directorySearchType: DirectorySearchType.None,
        atMentionTuples: {},
        mentionsAddedRecipients: [],
    };
    if (pendingSocialActivityTags && pendingSocialActivityTags.length > 0) {
        pendingSocialActivityTags.forEach(tag => {
            const parsedObj = JSON.parse(tag);
            if (parsedObj?.a && parsedObj.b) {
                const parsedTagContents = JSON.parse(parsedObj.a);
                if (parsedTagContents) {
                    if (
                        parsedObj.b == 'MentionAddedRecipients' &&
                        parsedTagContents instanceof Array
                    ) {
                        viewState.mentionsAddedRecipients = parsedTagContents as string[];
                    } else if (parsedTagContents.Mentioned) {
                        viewState.atMentionTuples[parsedObj.b] = {
                            EmailAddress: parsedTagContents.Mentioned,
                        };
                    }
                }
            }
        });
    }
    return viewState;
}
