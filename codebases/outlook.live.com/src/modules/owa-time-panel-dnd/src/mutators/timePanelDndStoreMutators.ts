import getStore from '../store/store';
import { mutator } from 'satcheljs';
import { initializeTimePanelDataForDnd } from '../actions/timePanelDndStoreActions';

mutator(initializeTimePanelDataForDnd, () => {
    getStore().isTimePanelDataInitialized = true;
});
