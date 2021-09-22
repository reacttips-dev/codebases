import { lightModeTextColors, darkModeTextColors } from './Colors';

export default function getDarkModeTextColorForLightModeColor(color: string): string | undefined {
    return darkModeTextColors[lightModeTextColors.indexOf(color)];
}
