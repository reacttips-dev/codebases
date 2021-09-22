import { createStore } from 'satcheljs';
import type CommandBarActionStore from './schema/CommandBarActionStore';

const defaultCommandBarActionStore = {
    surfaceActions: [],
    overflowActions: [],
};

export const getStore = createStore<CommandBarActionStore>(
    'commandBarAction',
    defaultCommandBarActionStore
);
export default getStore();
