import { createStore } from 'satcheljs';
import type { ExtendedTheme } from './schema/ExtendedTheme';

const initialStore: ExtendedTheme = {
    densityMode: 'Full',
    palette: undefined,
    fonts: undefined,
    isInverted: false,
    density: undefined,
};

export default createStore<ExtendedTheme>('fabricTheme', initialStore);
