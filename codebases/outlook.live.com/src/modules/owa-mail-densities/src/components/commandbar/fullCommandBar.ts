const btnstyle = {
    root: {
        fontSize: '14px',
        marginLeft: '4px ',
        padding: '0 8px 0 8px',
        alignSelf: 'center',
    },
    icon: {
        height: 'auto',
        display: 'flex',
        fontSize: '20px',
    },
};

export const fullCommandBarDensity = {
    components: {
        CommandBarButton: {
            styles: btnstyle,
        },
        CommandBar: {
            styles: {
                root: {
                    height: '48px',
                    alignItems: 'center',
                },
            },
        },
        Icon: {
            styles: {
                root: {
                    fontSize: '20px',
                    display: 'flex',
                },
            },
        },
    },
};
