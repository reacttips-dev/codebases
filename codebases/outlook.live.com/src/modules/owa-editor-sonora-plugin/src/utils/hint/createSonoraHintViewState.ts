import isSonoraPluginFileSuggestionsEnabled from 'owa-editor-sonora-common/lib/utils/file/isSonoraPluginFileSuggestionsEnabled';
import isSonoraPluginMeetingTimeSuggestionsEnabled from 'owa-editor-sonora-common/lib/utils/meetingTimes/isSonoraPluginMeetingTimeSuggestionsEnabled';
import isSonoraPluginStickyNoteSuggestionsEnabled from 'owa-editor-sonora-common/lib/utils/stickyNotes/isSonoraPluginStickyNoteSuggestionsEnabled';
import { SonoraEntityType, SonoraHintViewState } from 'owa-editor-sonora-types';

const createSonoraHintViewState = () => {
    const availableTypes: SonoraEntityType[] = [];
    let selectedType: SonoraEntityType | undefined;

    if (isSonoraPluginFileSuggestionsEnabled()) {
        availableTypes.push(SonoraEntityType.File);
    }

    if (isSonoraPluginStickyNoteSuggestionsEnabled()) {
        availableTypes.push(SonoraEntityType.StickyNotes);
    }

    if (isSonoraPluginMeetingTimeSuggestionsEnabled()) {
        availableTypes.push(SonoraEntityType.MeetingTimes);
    }

    if (availableTypes.length) {
        selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    }

    const viewState = <SonoraHintViewState>{
        selectedType: selectedType,
        intentDetectionHintShown: new Set<SonoraEntityType>(),
    };

    return viewState;
};

export default createSonoraHintViewState;
