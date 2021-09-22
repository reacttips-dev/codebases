const btnstyle = {
    root: {
        fontSize: '12px',
        marginLeft: '4px',
        padding: '0 6px 0 6px',
        alignSelf: 'center',
    },
    icon: {
        height: 'auto',
        display: 'flex',
        fontSize: '16px',
    },
};
export const mediumCommandBarDensity = {
    components: {
        CommandBarButton: {
            styles: btnstyle,
        },
        CommandBar: {
            styles: {
                root: {
                    height: '40px',
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
