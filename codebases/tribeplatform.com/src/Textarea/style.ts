import Input from '../Input/style';
const baseStyle = {
    ...Input.baseStyle({}).field,
    paddingY: '8px',
    minHeight: '80px',
    lineHeight: 'short',
};
const variants = {
    outline: (props) => Input.variants.outline(props).field,
    unstyled: (props) => Input.variants.unstyled(props).field,
};
const sizes = {
    sm: Input.sizes.sm.field,
    md: Input.sizes.md.field,
    lg: Input.sizes.lg.field,
};
const defaultProps = {
    size: 'md',
    variant: 'outline',
};
export default {
    baseStyle,
    sizes,
    variants,
    defaultProps,
};
//# sourceMappingURL=style.js.map