import { action } from 'satcheljs';

/**
 * Launches PopupClose Action
 */
export default action('POPUP_CLOSED', () => {
    return {
        isOpen: false,
    };
});
