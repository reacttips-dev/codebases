import { appendOnSendAction } from 'owa-addins-core';
import {
    AppendOnSend,
    AddinViewState,
    LastFocusedControl,
} from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';
import prependContentToEditor from 'owa-addins-editor-plugin/lib/utils/prependContentToEditor';
import setSelectedData from 'owa-addins-editor-plugin/lib/utils/setSelectedData';
import updateContentToEditor from 'owa-addins-editor-plugin/lib/utils/updateContentToEditor';
import type { SelectedData } from 'owa-addins-types';
import updateContent from 'owa-editor/lib/actions/updateContent';
import getSelectedData from 'owa-editor/lib/utils/getSelectedData';
import updateContentToViewState from 'owa-editor/lib/utils/updateContentToViewState';
import type { ComposeViewState } from 'owa-mail-compose-store';
import type BodyType from 'owa-service/lib/contract/BodyType';
import type { CompositeEditorViewState } from 'owa-editor/lib/store/schema/CompositeEditorViewState';

export const getBody = (viewState: ComposeViewState) => (): string => {
    updateContentToViewState(viewState);
    return viewState.content;
};

export const setBody = (viewState: ComposeViewState) => (
    content: string,
    bodyType: BodyType
): void => {
    updateContent(viewState, content);
    updateContentToEditor(viewState as CompositeEditorViewState, content);
};

export const getBodyType = (viewState: ComposeViewState) => (): BodyType => {
    return viewState.bodyType;
};

export const prependBody = (viewState: ComposeViewState) => (content: string) => {
    prependContentToEditor(viewState, content);
};

export const getBodySelectedData = (viewState: ComposeViewState) => (): SelectedData => {
    if (!isEditorLastFocusedControl(viewState.addin)) {
        return null;
    }
    return getSelectedData(viewState);
};

export const setBodySelectedData = (viewState: ComposeViewState) => (content: string) => {
    setSelectedData(viewState, content);
};

export const appendOnSend = (viewState: ComposeViewState) => (prop: AppendOnSend) => {
    appendOnSendAction(viewState.addin, prop);
};

function isEditorLastFocusedControl(viewState: AddinViewState): boolean {
    return viewState.lastFocusedControl === LastFocusedControl.Editor;
}
