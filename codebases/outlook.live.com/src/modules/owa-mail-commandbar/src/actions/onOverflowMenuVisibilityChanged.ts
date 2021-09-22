import { mutatorAction } from 'satcheljs';
import { getStore } from '../store/store';

// Update visibility of overflow menu of command bar
export const onOverflowMenuVisibilityChanged = mutatorAction(
    'onOverflowMenuVisibilityChanged',
    isOverflowMenuOpen => {
        getStore().isOverflowMenuOpen = isOverflowMenuOpen;
    }
);
