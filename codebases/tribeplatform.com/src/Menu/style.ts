const parts = ['button', 'list', 'item'];
const baseStyle = () => ({
    button: {
        width: '100%',
        px: '4',
        py: '2',
        borderWidth: '1px',
        borderRadius: 'md',
        fontWeight: 'bold',
    },
    list: {
        bg: 'bg.secondary',
        borderWidth: '1px',
        borderRadius: 'md',
        minWidth: 'xs',
        p: '2',
    },
    item: {
        p: '2',
        borderRadius: 'sm',
        _hover: {
            color: 'white',
            bg: 'accent.base',
        },
        _active: {
            color: 'white',
            bg: 'accent.base',
        },
        _focus: {
            color: 'white',
            bg: 'accent.base',
        },
    },
});
const sizes = {};
const defaultProps = {};
export default {
    parts,
    baseStyle,
    sizes,
    defaultProps,
};
//# sourceMappingURL=style.js.map