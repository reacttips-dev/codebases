import { mutatorAction } from 'satcheljs';
import listViewStore from '../store/Store';

export const clearListViewVirtualization = mutatorAction(
    'clearListViewVirtualization',
    (isNewTableLoad: boolean) => {
        // If we are clearing virtualization store values due to a new table load, reset all
        // parameters. Otherwise, set doNotVirtualize to true to avoid blank rows appearing in current view
        if (isNewTableLoad) {
            listViewStore.scrollTop = 0;
            listViewStore.doNotVirtualize = false;
        } else {
            listViewStore.doNotVirtualize = true;
        }

        listViewStore.rowInfoForVLV.clear();
    }
);
