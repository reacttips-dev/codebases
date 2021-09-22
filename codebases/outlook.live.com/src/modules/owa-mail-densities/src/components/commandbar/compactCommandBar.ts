const btnstyle = {
    root: {
        fontSize: '12px',
        marginLeft: '2px ',
        padding: '0 4px 0 4px',
        alignSelf: 'center',
    },
    icon: {
        height: 'auto',
        display: 'flex',
        fontSize: '16px',
    },
};
export const compactCommandBarDensity = {
    components: {
        CommandBarButton: {
            styles: btnstyle,
        },
        CommandBar: {
            styles: {
                root: {
                    height: '36px',
                    alignItems: 'center',
                },
            },
        },
        Icon: {
            styles: {
                root: {
                    fontSize: '16px',
                    display: 'flex',
                },
            },
        },
    },
};
