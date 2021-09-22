import { getBodySelectedData, setBodySelectedData } from './BodyAdapter';
import { getSubjectSelectedData, setSubjectSelectedData } from './SubjectAdapter';
import type { SelectedData } from 'owa-addins-types';
import type { ComposeViewState } from 'owa-mail-compose-store';
import { LastFocusedControl } from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';

export const getSelectedData = (viewState: ComposeViewState) => (): SelectedData => {
    if (viewState.addin.lastFocusedControl === LastFocusedControl.Editor) {
        return getBodySelectedData(viewState)();
    } else if (viewState.addin.lastFocusedControl === LastFocusedControl.SubjectLine) {
        return getSubjectSelectedData(viewState)();
    }

    return null;
};

export const setSelectedData = (viewState: ComposeViewState) => (content: string) => {
    if (viewState.addin.lastFocusedControl === LastFocusedControl.Editor) {
        setBodySelectedData(viewState)(content);
    } else if (viewState.addin.lastFocusedControl === LastFocusedControl.SubjectLine) {
        setSubjectSelectedData(viewState)(content);
    }

    return;
};
