import type { default as MsHighContrastStore } from './schema/MsHighContrastStore';
import { MsHighContrastMode } from './schema/MsHighContrastMode';
import { createStore } from 'satcheljs';

export const defaultMsHighContrastStore: MsHighContrastStore = {
    mode: MsHighContrastMode.None,
};

const initialStore = { ...defaultMsHighContrastStore };
export const getStore = createStore<MsHighContrastStore>('msHighContrastStore', initialStore);
