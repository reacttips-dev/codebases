import { getStore } from '../store/store';
import { MsHighContrastMode } from '../store/schema/MsHighContrastMode';

export default function getIsMsHighContrast(): boolean {
    return getStore().mode !== MsHighContrastMode.None;
}
