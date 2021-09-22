import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';

export function forgottenAttachmentsPluginTrigger(evt: PluginEvent) {
    return (
        evt.eventType === PluginEventType.EditorReady ||
        evt.eventType === PluginEventType.ContentChanged ||
        evt.eventType === PluginEventType.ExtractContentWithDom
    );
}
