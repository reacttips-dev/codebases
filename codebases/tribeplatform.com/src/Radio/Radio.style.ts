import Checkbox from '../Checkbox/Checkbox.style';
const parts = ['container', 'control', 'label'];
const baseStyleControl = props => {
    const { control: checkboxControl } = Checkbox.baseStyle(props);
    return {
        ...checkboxControl,
        borderRadius: 'full',
        border: '1px solid',
        _checked: {
            ...checkboxControl._checked,
            _before: {
                content: `""`,
                display: 'inline-block',
                pos: 'relative',
                w: '6px',
                h: '6px',
                borderRadius: '50%',
                bg: 'currentColor',
            },
        },
    };
};
const baseStyleLabel = props => {
    const { label: checkboxLabel } = Checkbox.baseStyle(props);
    return {
        ...checkboxLabel,
        alignItems: 'baseline',
    };
};
const baseStyle = (props) => {
    return {
        label: baseStyleLabel(props),
        control: baseStyleControl(props),
    };
};
const sizes = {
    md: {
        control: { w: 4, h: 4 },
        label: { fontSize: 'md' },
    },
    lg: {
        control: { w: 5, h: 5 },
        label: { fontSize: 'lg' },
    },
    sm: {
        control: { width: 3, height: 3 },
        label: { fontSize: 'sm' },
    },
};
const defaultProps = {
    size: 'md',
};
export default {
    parts,
    baseStyle,
    sizes,
    defaultProps,
};
//# sourceMappingURL=Radio.style.js.map