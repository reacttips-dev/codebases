import { getStore } from '../store/store';

export function isSuiteHeaderRendered(): boolean {
    return getStore().isRendered;
}
