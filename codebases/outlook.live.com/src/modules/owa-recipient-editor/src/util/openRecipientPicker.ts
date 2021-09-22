import { IEditor, PluginEventType } from 'roosterjs-editor-types';
import { INPUT_CLICK_EVENT_SOURCE } from '../constants';

export default function openRecipientPicker(editor?: IEditor) {
    editor?.triggerPluginEvent(PluginEventType.ContentChanged, {
        source: INPUT_CLICK_EVENT_SOURCE,
    });
}
