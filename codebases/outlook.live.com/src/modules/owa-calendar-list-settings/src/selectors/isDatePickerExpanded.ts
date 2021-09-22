import { getStore } from '../store/store';

export function isDatePickerExpanded(): boolean {
    return getStore().isDatePickerExpanded;
}
