import { getStore } from '../store/store';

export function isShySuiteHeaderMode(): boolean {
    return getStore().isShy;
}
