import createPickerPluginViewState from 'owa-editor-picker-plugin/lib/utils/createPickerPluginViewState';
import createFindControlViewState from 'owa-recipient-common/lib/utils/createFindControlViewState';
import { getGuid } from 'owa-guid';
import {
    SonoraEntityType,
    SonoraNetworkCallStatus,
    SonoraSuggestionsResults,
} from 'owa-editor-sonora-types';
import type SonoraMentionsViewState from '../store/schema/SonoraMentionsViewState';

export default function createSonoraMentionsViewState(): SonoraMentionsViewState {
    const viewState = <SonoraMentionsViewState>{
        ...createPickerPluginViewState(),

        // MENTIONS PROPERTIES
        wordBeforeCursor: '',
        atMentionTuples: {},
        mentionsAddedRecipients: [],
        ...createFindControlViewState(),

        // SONORA PROPERTIES
        sessionId: getGuid(),
        sequenceId: 0,
        selectedIndex: 0,
        accepted: false,
        results: {
            contactSuggestions: { suggestions: [], logicalId: undefined, traceId: undefined },
            stickyNotesSuggestions: { suggestions: [], logicalId: undefined, traceId: undefined },
            fileSuggestions: { suggestions: [], logicalId: undefined, traceId: undefined },
            meetingTimeSuggestions: { suggestions: [], logicalId: undefined, traceId: undefined },
            vivaTopicSuggestions: { suggestions: [], logicalId: undefined, traceId: undefined },
        } as SonoraSuggestionsResults,
        isClassicAttachmentActionPanelOpen: false,
        latestNetworkCallNumber: 0,
        latestNetworkCallStatus: SonoraNetworkCallStatus.Default,
        searchLatencyInMs: 0,
        // TODO: 119328 - utilize `createSonoraHintViewState` util
        selectedType: SonoraEntityType.File,
        intentDetectionHintShown: new Set<SonoraEntityType>(),
        intentDetectionHintCurrentlyShowing: undefined,
        intentDetectionHintAccepted: undefined,
    };

    return viewState;
}
