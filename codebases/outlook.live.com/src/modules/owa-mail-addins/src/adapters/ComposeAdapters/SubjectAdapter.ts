import type { SelectedData } from 'owa-addins-types';
import type { ComposeViewState } from 'owa-mail-compose-store';
import updateSubject from 'owa-mail-compose-actions/lib/actions/updateSubject';
import updateSubjectSelectionRange from 'owa-addins-editor-plugin/lib/actions/updateSubjectSelectionRange';
import {
    AddinViewState,
    LastFocusedControl,
} from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';

export const getSubject = (viewState: ComposeViewState) => (): string => {
    return viewState.subject;
};

export const setSubject = (viewState: ComposeViewState) => (subject: string): void => {
    updateSubject(viewState, subject);
};

export const setSubjectSelectedData = (viewState: ComposeViewState) => (content: string): void => {
    if (!isSubjectLineLastFocusedControl(viewState.addin)) {
        return;
    }

    let value = viewState.subject;
    const { selectionStart, selectionEnd } = viewState.addin.subject;
    value = value.slice(0, selectionStart) + content + value.slice(selectionEnd);
    updateSubject(viewState, value);
    const cursorPosition = selectionStart + content.length;
    updateSubjectSelectionRange(viewState.addin.subject, cursorPosition, cursorPosition);
};

export const getSubjectSelectedData = (viewState: ComposeViewState) => (): SelectedData => {
    if (!isSubjectLineLastFocusedControl(viewState.addin)) {
        return null;
    }

    const { selectionStart, selectionEnd } = viewState.addin.subject;

    let value = viewState.subject;
    value = value.slice(selectionStart, selectionEnd);

    return {
        data: value,
        sourceProperty: 'subject',
        startPosition: selectionStart,
        endPosition: selectionEnd,
    };
};

function isSubjectLineLastFocusedControl(viewState: AddinViewState): boolean {
    return viewState.lastFocusedControl === LastFocusedControl.SubjectLine;
}
