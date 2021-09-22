import type {
    default as ActionableMessageStore,
    ActionableMessageCardState,
} from './schema/ActionableMessageStore';
import ThemeLoadStatus from './schema/ThemeLoadStatus';
import type ThemeStore from './schema/ThemeStore';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';

const initialThemeStore: ThemeStore = {
    loadStatus: ThemeLoadStatus.NotLoaded,
    themeMapping: {},
};

const initialActionableMessageStore: ActionableMessageStore = {
    themeStore: initialThemeStore,
    cards: new ObservableMap<string, ActionableMessageCardState>(),
};

export const getStore = createStore<ActionableMessageStore>(
    'ActionableMessageV2',
    initialActionableMessageStore
);
export default getStore();
