import { getColor } from '@chakra-ui/theme-tools';
import Color from 'color';
export const toShadow = (theme, themeColor) => {
    try {
        const hexColor = getColor(theme, themeColor, themeColor);
        return Color(hexColor)
            .fade(0.7)
            .rgb()
            .string();
    }
    catch {
        return null;
    }
};
//# sourceMappingURL=color.utils.js.map