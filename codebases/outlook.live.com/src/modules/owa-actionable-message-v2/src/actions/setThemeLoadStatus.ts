import store from '../store/Store';
import { mutatorAction } from 'satcheljs';
import type ThemeLoadStatus from '../store/schema/ThemeLoadStatus';

export default mutatorAction(
    'setThemeLoadStatus',
    function setThemeLoadStatus(loadStatus: ThemeLoadStatus) {
        store.themeStore.loadStatus = loadStatus;
    }
);
