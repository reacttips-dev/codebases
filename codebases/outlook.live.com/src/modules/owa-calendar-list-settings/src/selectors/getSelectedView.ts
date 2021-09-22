import { getStore } from '../store/store';

export function getSelectedView() {
    return getStore().selectedView;
}
