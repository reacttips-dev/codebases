import { loadTheme } from '@fluentui/style-utilities';
import store from '../store/store';

export default function updateFabricTheme() {
    const { palette, fonts, isInverted } = store();

    loadTheme({
        fonts,
        isInverted,
        palette,
    });
}
