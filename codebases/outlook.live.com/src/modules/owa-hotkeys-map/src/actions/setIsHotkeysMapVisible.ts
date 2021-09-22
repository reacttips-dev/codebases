import store from '../store/Store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setIsHotkeysMapVisible',
    function setIsHotkeysMapVisible(isVisible: boolean) {
        store.isVisible = isVisible;
    }
);
