import { getStore } from '../store/store';

export function isFlexPaneShown(): boolean {
    return getStore().isFlexPaneShown;
}
