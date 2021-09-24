const TableTheme = {
    parts: ['header', 'row', 'loading'],
    baseStyle: () => ({
        header: {
            width: 'full',
            borderRadius: 'lg',
            py: 4,
            px: 6,
            color: 'tertiary',
            backgroundColor: 'transparent',
            display: 'block',
        },
        row: {
            width: 'full',
            py: 4,
            px: 6,
            borderTop: '1px solid',
            borderTopColor: 'border.lite',
        },
        loading: {
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%)',
        },
    }),
};
export default TableTheme;
//# sourceMappingURL=index.js.map