const UserbarTheme = {
    parts: ['box', 'title', 'subtitle'],
    baseStyle: props => ({
        box: {
            marginRight: 2,
        },
        title: {
            display: props.ellipsis ? 'block' : 'flex',
            alignItems: 'center',
            columnGap: 4,
            color: 'label.primary',
            fontWeight: 'bold',
            lineHeight: '22px',
            fontSize: 'md',
        },
        subtitle: {
            color: 'label.secondary',
            fontSize: 'sm',
            fontWeight: 'regular',
            marginTop: 1,
        },
    }),
    sizes: {
        lg: {
            title: {
                fontSize: 'md',
                fontWeight: 'medium',
            },
        },
        xl: {
            title: {
                fontSize: 'lg',
            },
        },
    },
    defaultProps: {
        size: 'lg',
    },
};
export default UserbarTheme;
//# sourceMappingURL=index.js.map