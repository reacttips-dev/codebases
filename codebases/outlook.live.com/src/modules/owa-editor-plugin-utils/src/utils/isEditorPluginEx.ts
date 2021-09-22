import type { EditorPlugin } from 'roosterjs-editor-types';
import type EditorPluginEx from '../schema/EditorPluginEx';

export default function isEditorPluginEx(plugin: EditorPlugin): plugin is EditorPluginEx {
    return plugin && !!(plugin as EditorPluginEx).setPluginUtils;
}
