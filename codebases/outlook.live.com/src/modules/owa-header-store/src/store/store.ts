import { createStore } from 'satcheljs';
import type { HeaderViewState } from './schema/HeaderViewState';

var initialHeaderViewState: HeaderViewState = {
    activeCharm: null,
};

export var getStore = createStore<HeaderViewState>('headerViewState', initialHeaderViewState);
