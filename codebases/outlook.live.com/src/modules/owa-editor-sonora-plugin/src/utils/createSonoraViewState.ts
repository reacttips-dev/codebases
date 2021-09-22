import createPickerPluginViewState from 'owa-editor-picker-plugin/lib/utils/createPickerPluginViewState';
import { getGuid } from 'owa-guid';

import {
    SonoraNetworkCallStatus,
    SonoraSuggestionsResults,
    SonoraViewState,
} from 'owa-editor-sonora-types';
import createSonoraHintViewState from './hint/createSonoraHintViewState';

const createSonoraViewState = () => {
    const viewState = <SonoraViewState>{
        ...createPickerPluginViewState(),
        sessionId: getGuid(),
        sequenceId: 0,
        queryString: '',
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
        ...createSonoraHintViewState(),
    };

    return viewState;
};

export default createSonoraViewState;
