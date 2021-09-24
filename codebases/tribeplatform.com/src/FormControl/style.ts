const parts = ['errorText', 'errorIcon', 'requiredIndicator', 'helperText'];
const baseStyleErrorText = {
    color: 'danger.base',
    mt: 2,
    fontSize: 'xs',
};
const baseStyleRequiredIndicator = {
    ml: 1,
    color: 'danger.base',
};
const baseStyleHelperText = {
    mt: 2,
    color: 'tertiary',
    lineHeight: 'normal',
    fontSize: 'xs',
};
const baseStyleErrorIcon = {
    mr: '0.5em',
    color: 'danger.base',
};
const baseStyle = () => ({
    errorText: baseStyleErrorText,
    requiredIndicator: baseStyleRequiredIndicator,
    helperText: baseStyleHelperText,
    errorIcon: baseStyleErrorIcon,
});
export default {
    parts,
    baseStyle,
};
//# sourceMappingURL=style.js.map