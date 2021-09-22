import { EditorViewState, lazyOperateContent } from 'owa-editor';

export const SHOW_EDITOR_SETTINGS_SOURCE = '_ShowEditorSettingsSource';

export default function showEditorSettings(
    viewState: EditorViewState,
    targetWindow: Window
): () => void {
    return () => {
        // TODO: !!!!!HACK HERE, SHOULD AVOID!!!!!
        // The code to show Editor settings should be moved out from plugin, and we should not trigger event here
        lazyOperateContent.import().then(operateContent =>
            operateContent(viewState, editor => {
                editor.triggerContentChangedEvent(SHOW_EDITOR_SETTINGS_SOURCE, targetWindow);
                return null;
            })
        );
    };
}
