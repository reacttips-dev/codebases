import getDefaultSettings from './getDefaultSettings';
import saveDefaultSettings from './services/saveDefaultSettings';
import updateDefaultSettings from './actions/updateDefaultSettings';

export default function initialize() {
    const defaultSettings = getDefaultSettings();
    if (defaultSettings) {
        updateDefaultSettings(defaultSettings);
        saveDefaultSettings();
    }
}
