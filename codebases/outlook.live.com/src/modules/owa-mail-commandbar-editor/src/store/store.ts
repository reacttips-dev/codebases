import { createStore } from 'satcheljs';
import type CommandBarEditorStore from './schema/CommandBarEditorStore';

const defaultCommandBarEditorStore = {
    selectedActions: null,
    unselectedActions: null,
    dragAction: null,
    keyboardModeAction: null,
    isEditing: false,
};

export const getStore = createStore<CommandBarEditorStore>(
    'commandBarEditor',
    defaultCommandBarEditorStore
);
export default getStore();
