const boxStyles = {
    backgroundColor: 'bg.base',
    width: '120px',
    height: '120px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    rounded: 'base',
};
const ImageUploadTheme = {
    parts: ['box', 'edit', 'upload', 'icon'],
    baseStyle: props => ({
        box: {
            position: 'relative',
            overflow: 'hidden',
            marginTop: '0 !important',
        },
        edit: {
            _before: {
                bg: 'label.primary',
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: props.isEmpty ? 0.8 : 0.2,
                rounded: 'base',
            },
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        icon: {
            width: '.5em',
            position: 'absolute',
        },
        image: {
            display: 'block',
            height: 'auto',
            width: '100%',
        },
        upload: {
            opacity: 'var(--tribe-opacity-invisible)',
            width: '100%',
            cursor: 'pointer',
            height: '100%',
            position: 'absolute',
        },
    }),
    variants: {
        avatar: () => ({
            box: boxStyles,
            edit: {
                _before: {
                    rounded: 'full',
                },
            },
            icon: {
                width: '1em',
            },
        }),
        logo: ({ isSquared = false }) => ({
            box: {
                ...boxStyles,
                width: isSquared ? boxStyles.width : '215px',
            },
            edit: {
                _before: {
                    rounded: 'base',
                },
            },
            icon: {
                width: '1em',
            },
        }),
    },
};
export default ImageUploadTheme;
//# sourceMappingURL=index.js.map