import { getStore } from '../store/store';
import type { MsHighContrastMode } from '../store/schema/MsHighContrastMode';

export default function getMsHighContrastMode(): MsHighContrastMode {
    return getStore().mode;
}
