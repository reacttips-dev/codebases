import { action } from 'satcheljs';
import type { ExtendedPalette } from '../store/schema/ExtendedTheme';

export default action(
    'CHANGE_FABRIC_THEME',
    (themeSymbols: Partial<ExtendedPalette>, isDarkTheme: boolean) => ({
        themeSymbols,
        isDarkTheme,
    })
);
