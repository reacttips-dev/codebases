import { getStore } from '../store/store';

export default function isDateRefinerApplied(): boolean {
    return getStore().fromDate !== null || getStore().toDate !== null;
}
