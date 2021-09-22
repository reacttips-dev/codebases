import store from '../store/store';
import type { AddinCommandSurfaceItem, ExtensibilityModeEnum } from 'owa-addins-types';

export default function getAddinOptionSurfaceItems(
    mode: ExtensibilityModeEnum
): AddinCommandSurfaceItem[] {
    return store.addinOptionSurfaceItems[mode];
}
