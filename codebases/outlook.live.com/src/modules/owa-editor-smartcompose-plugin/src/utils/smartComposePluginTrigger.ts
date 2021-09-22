import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';

export default function smartComposePluginTrigger(evt: PluginEvent) {
    return (
        evt.eventType === PluginEventType.KeyUp ||
        evt.eventType === PluginEventType.MouseUp ||
        evt.eventType === PluginEventType.ContentChanged
    );
}
