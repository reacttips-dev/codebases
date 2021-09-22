import baseNeutralPalette from '../resources/neutral.color.variables.base.json';
import darkNeutralPalette from '../resources/neutral.color.variables.dark.json';

export default function getNeutralPaletteAsRawColors(isDarkTheme: boolean) {
    return isDarkTheme ? darkNeutralPalette : baseNeutralPalette;
}
