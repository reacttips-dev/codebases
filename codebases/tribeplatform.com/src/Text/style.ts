import { textStyles } from '../theme/foundations/typography';
export const ELLIPSIS_STYLES = {
    display: 'block',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
};
const baseStyle = ({ ellipsis, textStyle, fontSize, fontWeight, color, textAlign, }) => {
    const styles = {
        color: 'label.primary',
        ...textStyles['semantic/body/normal'],
        ...textStyles[textStyle],
    };
    if (fontSize)
        styles.fontSize = fontSize;
    if (fontWeight)
        styles.fontWeight = fontWeight;
    if (color)
        styles.color = color;
    if (textAlign)
        styles.textAlign = textAlign;
    // If you want 3 dots at the end
    if (ellipsis) {
        return {
            ...styles,
            ...ELLIPSIS_STYLES,
        };
    }
    return styles;
};
const defaultProps = {};
const style = {
    baseStyle,
    defaultProps,
};
export default style;
//# sourceMappingURL=style.js.map