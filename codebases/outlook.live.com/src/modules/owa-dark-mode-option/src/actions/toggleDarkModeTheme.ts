import { action } from 'satcheljs';

export default action('TOGGLE_DARK_MODE_THEME', (isDarkModeEnabled: boolean) => ({
    isDarkModeEnabled,
}));
