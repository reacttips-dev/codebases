import { mutatorAction } from 'satcheljs';
import { getStore } from '../store/store';
import type { MsHighContrastMode } from '../store/schema/MsHighContrastMode';

export default mutatorAction('setMsHighContrastMode', (mode: MsHighContrastMode) => {
    getStore().mode = mode;
});
