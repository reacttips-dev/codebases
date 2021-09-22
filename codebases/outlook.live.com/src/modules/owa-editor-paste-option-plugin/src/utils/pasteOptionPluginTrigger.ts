import { PluginEvent, ChangeSource, PluginEventType } from 'roosterjs-editor-types';

export default function pasteOptionPluginTrigger(evt: PluginEvent) {
    return evt.eventType === PluginEventType.ContentChanged && evt.source == ChangeSource.Paste;
}
