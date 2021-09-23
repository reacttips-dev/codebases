import { keyframes } from '@chakra-ui/system';
import { getColor } from '@chakra-ui/theme-tools';
const fade = (startColor, endColor) => keyframes({
    from: { borderColor: startColor, background: startColor },
    to: { borderColor: endColor, background: endColor },
});
const baseStyle = (props) => {
    const defaultStartColor = 'highlight';
    const defaultEndColor = 'bg.secondary';
    const { startColor = defaultStartColor, endColor = defaultEndColor, speed, theme, } = props;
    const start = getColor(theme, startColor);
    const end = getColor(theme, endColor);
    return {
        opacity: 0.7,
        borderColor: start,
        background: end,
        animation: `${speed}s linear infinite alternate ${fade(start, end)}`,
    };
};
export default {
    baseStyle,
};
//# sourceMappingURL=Skeleton.style.js.map