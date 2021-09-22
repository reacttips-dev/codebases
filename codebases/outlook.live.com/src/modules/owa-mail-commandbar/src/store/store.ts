import { createStore } from 'satcheljs';
import type CommandBarStore from './schema/CommandBarStore';

const defaultCommandBarStore = {
    isEditing: false,
    isOverflowMenuOpen: false,
};

export const getStore = createStore<CommandBarStore>('commandBar', defaultCommandBarStore);
export default getStore();
