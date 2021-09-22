import { getStore } from '../store/store';

export function isTaskListSelected(): boolean {
    return getStore().isTaskListSelected;
}
