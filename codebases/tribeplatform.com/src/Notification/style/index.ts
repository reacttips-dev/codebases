const NotificationTheme = {
    parts: ['card', 'title', 'time', 'newNotification'],
    baseStyle: () => ({
        card: {
            border: '1px solid',
            borderTop: 'none',
            borderColor: 'stroke',
            boxShadow: 'none',
            bg: 'bg.base',
            px: 4,
            py: 5,
            cursor: 'pointer',
            _first: {
                borderTopRadius: 'base',
            },
            _last: {
                borderBottomRadius: 'base',
            },
        },
        title: {
            color: 'label.secondary',
            lineHeight: '16px',
            fontSize: 'sm',
            fontWeight: 'regular',
        },
        time: {
            color: 'label.secondary',
            fontSize: 'xs',
        },
        newNotification: {
            bg: 'accent.base',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
        },
    }),
};
export default NotificationTheme;
//# sourceMappingURL=index.js.map