const SearchResultTheme = {
    parts: ['card', 'title', 'subtext'],
    baseStyle: () => ({
        card: {
            borderRadius: 'base',
            boxShadow: 'none',
            padding: 3,
            paddingRight: 5,
            cursor: 'pointer',
            border: 'none',
        },
        title: {
            color: 'label.primary',
            lineHeight: '16px',
            fontSize: '0.875rem',
            fontWeight: 'medium',
            marginBottom: 1,
        },
        subtext: {
            color: 'label.secondary',
            fontSize: 'sm',
        },
    }),
};
export default SearchResultTheme;
//# sourceMappingURL=index.js.map