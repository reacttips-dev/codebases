import { action } from 'satcheljs';

/**
 * Launches PopupOpen Action
 */
export default action('POPUP_OPENED', () => {
    return {
        isOpen: true,
    };
});
