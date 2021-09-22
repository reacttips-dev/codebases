import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';

export default function linkPluginTrigger(evt: PluginEvent) {
    return (
        evt.eventType === PluginEventType.ContentChanged ||
        evt.eventType === PluginEventType.EditorReady ||
        evt.eventType === PluginEventType.BeforePaste ||
        evt.eventType === PluginEventType.ExtractContentWithDom ||
        evt.eventType === PluginEventType.KeyUp ||
        evt.eventType === PluginEventType.MouseUp ||
        evt.eventType === PluginEventType.KeyDown ||
        evt.eventType === PluginEventType.KeyPress
    );
}
